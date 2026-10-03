require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

const testUsers = [
  {
    id: 1,
    username: "student",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "STUDENT",
  },
  {
    id: 2,
    username: "maintainer",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "MAINTAINER",
  },
  {
    id: 3,
    username: "admin",
    passwordHash: bcrypt.hashSync("password123", 10),
    role: "ADMIN",
  },
];

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.json({ message: "LEKH API is running" });
});

app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  const user = testUsers.find((testUser) => testUser.username === username);

  if (!user) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  req.session.user = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  return res.json({
    message: "Login successful",
    user: req.session.user,
  });
});

app.get("/api/session", requireAuth, (req, res) => {
  return res.json({
    user: req.session.user,
  });
});

function requireGuideManager(req, res, next) {
  const role = req.session.user?.role;

  if (role !== "MAINTAINER" && role !== "ADMIN") {
    return res.status(403).json({
      message: "Maintainer or Administrator access required",
    });
  }

  next();
}

app.get("/api/equipment", requireAuth, async (req, res) => {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.json(equipment);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load equipment",
    });
  }
});

app.post(
  "/api/equipment",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const { name, typeModel, totalQuantity, location, condition } = req.body;

    const quantity = Number(totalQuantity);

    if (
      !name?.trim() ||
      !typeModel?.trim() ||
      !location?.trim() ||
      !condition?.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Valid equipment information is required",
      });
    }

    try {
      const equipment = await prisma.equipment.create({
        data: {
          name: name.trim(),
          typeModel: typeModel.trim(),
          location: location.trim(),
          totalQuantity: quantity,
          availableQuantity: quantity,
          condition: condition.trim(),
        },
      });

      return res.status(201).json(equipment);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to create equipment",
      });
    }
  },
);

app.put(
  "/api/equipment/:id",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const id = Number(req.params.id);
    const { name, typeModel, totalQuantity, location, condition } = req.body;

    const quantity = Number(totalQuantity);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Valid equipment ID is required",
      });
    }

    if (
      !name?.trim() ||
      !typeModel?.trim() ||
      !location?.trim() ||
      !condition?.trim() ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        message: "Valid equipment information is required",
      });
    }

    try {
      const existingEquipment = await prisma.equipment.findUnique({
        where: { id },
      });

      if (!existingEquipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }

      const unavailableQuantity =
        existingEquipment.totalQuantity - existingEquipment.availableQuantity;

      if (quantity < unavailableQuantity) {
        return res.status(400).json({
          message:
            "Total quantity cannot be lower than the number of unavailable items",
        });
      }

      const equipment = await prisma.equipment.update({
        where: { id },
        data: {
          name: name.trim(),
          typeModel: typeModel.trim(),
          location: location.trim(),
          totalQuantity: quantity,
          availableQuantity: quantity - unavailableQuantity,
          condition: condition.trim(),
        },
      });

      return res.json(equipment);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to update equipment",
      });
    }
  },
);

app.get("/api/equipment/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
    });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    return res.json(equipment);
  } catch (error) {
    return res.status(500).json({
      message: "Unable to load equipment",
    });
  }
});

app.get("/api/equipment/:id/guide", requireAuth, async (req, res) => {
  const equipmentId = Number(req.params.id);

  try {
    const guide = await prisma.guide.findFirst({
      where: {
        equipmentId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    if (!guide) {
      return res.status(404).json({
        message: "Guide not found",
      });
    }

    return res.json(guide);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Unable to load equipment guide",
    });
  }
});

app.get("/api/equipment/:id/troubleshooting", requireAuth, async (req, res) => {
  const equipmentId = Number(req.params.id);

  try {
    const troubleshooting = await prisma.troubleshooting.findMany({
      where: {
        equipmentId,
      },
      orderBy: {
        id: "asc",
      },
    });

    return res.json(troubleshooting);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to load troubleshooting information",
    });
  }
});

app.post(
  "/api/equipment/:id/troubleshooting",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const equipmentId = Number(req.params.id);
    const { problem, solution } = req.body;

    if (!problem || !solution) {
      return res.status(400).json({
        message: "Problem and solution are required",
      });
    }

    try {
      const equipment = await prisma.equipment.findUnique({
        where: {
          id: equipmentId,
        },
      });

      if (!equipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }

      const troubleshooting = await prisma.troubleshooting.create({
        data: {
          equipmentId,
          problem,
          solution,
        },
      });

      return res.status(201).json(troubleshooting);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to create troubleshooting information",
      });
    }
  },
);

app.put(
  "/api/equipment/:equipmentId/troubleshooting/:troubleshootingId",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const equipmentId = Number(req.params.equipmentId);
    const troubleshootingId = Number(req.params.troubleshootingId);
    const { problem, solution } = req.body;

    if (!problem || !solution) {
      return res.status(400).json({
        message: "Problem and solution are required",
      });
    }

    try {
      const troubleshooting = await prisma.troubleshooting.findFirst({
        where: {
          id: troubleshootingId,
          equipmentId,
        },
      });

      if (!troubleshooting) {
        return res.status(404).json({
          message: "Troubleshooting information not found",
        });
      }

      const updatedTroubleshooting = await prisma.troubleshooting.update({
        where: {
          id: troubleshootingId,
        },
        data: {
          problem,
          solution,
        },
      });

      return res.json(updatedTroubleshooting);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to update troubleshooting information",
      });
    }
  },
);

app.post(
  "/api/equipment/:id/guide",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const equipmentId = Number(req.params.id);
    const { setup, usage } = req.body;

    if (!setup || !usage) {
      return res.status(400).json({
        message: "Setup and usage instructions are required",
      });
    }

    try {
      const equipment = await prisma.equipment.findUnique({
        where: {
          id: equipmentId,
        },
      });

      if (!equipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }

      const guide = await prisma.guide.create({
        data: {
          equipmentId,
          setup,
          usage,
        },
      });

      return res.status(201).json(guide);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to create equipment guide",
      });
    }
  },
);

app.put(
  "/api/equipment/:id/guide",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const equipmentId = Number(req.params.id);
    const { setup, usage } = req.body;

    if (!setup || !usage) {
      return res.status(400).json({
        message: "Setup and usage instructions are required",
      });
    }

    try {
      const existingGuide = await prisma.guide.findFirst({
        where: {
          equipmentId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

      if (!existingGuide) {
        return res.status(404).json({
          message: "Guide not found",
        });
      }

      const guide = await prisma.guide.update({
        where: {
          id: existingGuide.id,
        },
        data: {
          setup,
          usage,
        },
      });

      return res.json(guide);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to update equipment guide",
      });
    }
  },
);

app.post("/api/loans", requireAuth, async (req, res) => {
  const { equipmentId, startDate, endDate } = req.body;

  const parsedEquipmentId = Number(equipmentId);
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (
    !Number.isInteger(parsedEquipmentId) ||
    !startDate ||
    !endDate ||
    Number.isNaN(parsedStartDate.getTime()) ||
    Number.isNaN(parsedEndDate.getTime())
  ) {
    return res.status(400).json({
      message: "Valid equipment and borrowing period are required",
    });
  }

  if (parsedEndDate <= parsedStartDate) {
    return res.status(400).json({
      message: "End date must be after start date",
    });
  }

  const borrowingPeriodMs = parsedEndDate - parsedStartDate;
  const maximumBorrowingPeriodMs = 56 * 24 * 60 * 60 * 1000;

  if (borrowingPeriodMs > maximumBorrowingPeriodMs) {
    return res.status(400).json({
      message: "Borrowing period cannot exceed 8 weeks",
    });
  }

  try {
    const equipment = await prisma.equipment.findUnique({
      where: {
        id: parsedEquipmentId,
      },
    });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    if (equipment.availableQuantity < 1) {
      return res.status(409).json({
        message: "Equipment is not available",
      });
    }

    const approvalRequired = equipment.approvalRequired;

    if (approvalRequired) {
      const loan = await prisma.loan.create({
        data: {
          equipmentId: equipment.id,
          borrowerId: req.session.user.id,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          approvalStatus: "PENDING",
          loanStatus: "REQUESTED",
        },
      });

      return res.status(201).json(loan);
    }

    const loan = await prisma.$transaction(async (transaction) => {
      const activeLoan = await transaction.loan.create({
        data: {
          equipmentId: equipment.id,
          borrowerId: req.session.user.id,
          startDate: parsedStartDate,
          endDate: parsedEndDate,
          approvalStatus: "NOT_REQUIRED",
          loanStatus: "ACTIVE",
        },
      });

      await transaction.equipment.update({
        where: {
          id: equipment.id,
        },
        data: {
          availableQuantity: {
            decrement: 1,
          },
        },
      });

      return activeLoan;
    });

    return res.status(201).json(loan);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to submit loan request",
    });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Unable to log out",
      });
    }

    res.clearCookie("connect.sid");

    return res.json({
      message: "Logout successful",
    });
  });
});

app.listen(PORT, () => {
  console.log(`LEKH server running on http://localhost:${PORT}`);
});
