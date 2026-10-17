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
const PORT = 4000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

const USERNAME_PATTERN = /^[a-z0-9._-]{3,30}$/;
const MINIMUM_PASSWORD_LENGTH = 8;

function normalizeUsername(username) {
  return typeof username === "string" ? username.trim().toLowerCase() : "";
}

function toSessionUser(user) {
  return {
    id: user.id,
    username: user.username,
    role: user.role,
  };
}

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

app.post("/api/register", async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const { password } = req.body;

  if (!USERNAME_PATTERN.test(username)) {
    return res.status(400).json({
      message:
        "Username must be 3-30 characters and contain only letters, numbers, dots, dashes or underscores",
    });
  }

  if (
    typeof password !== "string" ||
    password.length < MINIMUM_PASSWORD_LENGTH
  ) {
    return res.status(400).json({
      message: `Password must be at least ${MINIMUM_PASSWORD_LENGTH} characters`,
    });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        passwordHash,
        role: "STUDENT",
      },
    });

    req.session.user = toSessionUser(user);

    return res.status(201).json({
      message: "Registration successful",
      user: req.session.user,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        message: "Username is already taken",
      });
    }

    console.error(error);

    return res.status(500).json({
      message: "Unable to register user",
    });
  }
});

app.post("/api/login", async (req, res) => {
  const username = normalizeUsername(req.body.username);
  const { password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    const passwordMatches =
      user && (await bcrypt.compare(password, user.passwordHash));

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    req.session.user = toSessionUser(user);

    return res.json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to log in",
    });
  }
});

app.get("/api/session", requireAuth, (req, res) => {
  return res.json({
    user: req.session.user,
  });
});

const unitStatusSelect = {
  units: {
    select: {
      status: true,
    },
  },
};

function withUnitCounts(equipment) {
  const { units, ...rest } = equipment;

  return {
    ...rest,
    totalQuantity: units.length,
    availableQuantity: units.filter((unit) => unit.status === "AVAILABLE")
      .length,
  };
}

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
      include: unitStatusSelect,
    });

    return res.json(equipment.map(withUnitCounts));
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
    const { name, typeModel, category, totalQuantity, location, condition } =
      req.body;

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
      const equipment = await prisma.$transaction(async (transaction) => {
        const createdEquipment = await transaction.equipment.create({
          data: {
            name: name.trim(),
            typeModel: typeModel.trim(),
            category: category?.trim() || "Other",
            location: location.trim(),
            totalQuantity: quantity,
            availableQuantity: quantity,
            condition: condition.trim(),
          },
        });

        await transaction.equipmentUnit.createMany({
          data: Array.from({ length: quantity }, (_, index) => ({
            equipmentId: createdEquipment.id,
            identifier: `EQ${createdEquipment.id}-${String(index + 1).padStart(3, "0")}`,
            location: location.trim(),
            condition: "Good",
          })),
        });

        return transaction.equipment.findUnique({
          where: { id: createdEquipment.id },
          include: unitStatusSelect,
        });
      });

      return res.status(201).json(withUnitCounts(equipment));
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
    const { name, typeModel, category, location, condition } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Valid equipment ID is required",
      });
    }

    if (
      !name?.trim() ||
      !typeModel?.trim() ||
      !location?.trim() ||
      !condition?.trim()
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

      const equipment = await prisma.equipment.update({
        where: { id },
        data: {
          name: name.trim(),
          typeModel: typeModel.trim(),
          category: category?.trim() || "Other",
          location: location.trim(),
          condition: condition.trim(),
        },
        include: unitStatusSelect,
      });

      return res.json(withUnitCounts(equipment));
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
      include: unitStatusSelect,
    });

    if (!equipment) {
      return res.status(404).json({
        message: "Equipment not found",
      });
    }

    return res.json(withUnitCounts(equipment));
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

const UNIT_STATUSES = ["AVAILABLE", "ON_LOAN", "OUT_OF_SERVICE"];

app.get("/api/equipment/:id/units", requireAuth, async (req, res) => {
  const equipmentId = Number(req.params.id);

  try {
    const units = await prisma.equipmentUnit.findMany({
      where: { equipmentId },
      orderBy: { identifier: "asc" },
    });

    return res.json(units);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to load units",
    });
  }
});

app.post(
  "/api/equipment/:id/units",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const equipmentId = Number(req.params.id);
    const { identifier, location, condition } = req.body;

    if (!identifier?.trim() || !location?.trim() || !condition?.trim()) {
      return res.status(400).json({
        message: "Identifier, location and condition are required",
      });
    }

    try {
      const equipment = await prisma.equipment.findUnique({
        where: { id: equipmentId },
      });

      if (!equipment) {
        return res.status(404).json({
          message: "Equipment not found",
        });
      }

      const unit = await prisma.equipmentUnit.create({
        data: {
          equipmentId,
          identifier: identifier.trim().toUpperCase(),
          location: location.trim(),
          condition: condition.trim(),
        },
      });

      return res.status(201).json(unit);
    } catch (error) {
      if (error.code === "P2002") {
        return res.status(409).json({
          message: "A unit with this identifier already exists",
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Unable to create unit",
      });
    }
  },
);

app.get("/api/units/:id", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "Valid unit ID is required",
    });
  }

  try {
    const unit = await prisma.equipmentUnit.findUnique({
      where: { id },
      include: {
        equipment: {
          select: {
            id: true,
            name: true,
            typeModel: true,
            category: true,
            troubleshooting: { orderBy: { id: "asc" } },
          },
        },
        loans: {
          where: { approvalStatus: "APPROVED" },
          orderBy: { startDate: "desc" },
          select: {
            id: true,
            startDate: true,
            endDate: true,
            loanStatus: true,
            returnedAt: true,
            borrower: { select: { username: true } },
          },
        },
        faults: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            description: true,
            createdAt: true,
            reporter: { select: { username: true } },
          },
        },
      },
    });

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found",
      });
    }

    // Students see when a unit was borrowed and what is wrong with it,
    // but not who borrowed it or who reported the fault.
    if (req.session.user.role === "STUDENT") {
      unit.loans = unit.loans.map((loan) => ({ ...loan, borrower: null }));
      unit.faults = unit.faults.map((fault) => ({ ...fault, reporter: null }));
    }

    return res.json(unit);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to load unit",
    });
  }
});

const MAXIMUM_FAULT_LENGTH = 1000;

app.post("/api/units/:id/faults", requireAuth, async (req, res) => {
  const equipmentUnitId = Number(req.params.id);
  const description =
    typeof req.body.description === "string" ? req.body.description.trim() : "";

  if (!Number.isInteger(equipmentUnitId) || equipmentUnitId < 1) {
    return res.status(400).json({
      message: "Valid unit ID is required",
    });
  }

  if (!description || description.length > MAXIMUM_FAULT_LENGTH) {
    return res.status(400).json({
      message: `Describe the fault in 1-${MAXIMUM_FAULT_LENGTH} characters`,
    });
  }

  try {
    const unit = await prisma.equipmentUnit.findUnique({
      where: { id: equipmentUnitId },
    });

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found",
      });
    }

    const fault = await prisma.fault.create({
      data: {
        equipmentUnitId,
        reporterId: req.session.user.id,
        description,
      },
    });

    return res.status(201).json(fault);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to report fault",
    });
  }
});

app.put(
  "/api/units/:id",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const id = Number(req.params.id);
    const { identifier, location, condition, status } = req.body;

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Valid unit ID is required",
      });
    }

    if (
      !identifier?.trim() ||
      !location?.trim() ||
      !condition?.trim() ||
      !UNIT_STATUSES.includes(status)
    ) {
      return res.status(400).json({
        message: "Valid unit information is required",
      });
    }

    try {
      const existingUnit = await prisma.equipmentUnit.findUnique({
        where: { id },
      });

      if (!existingUnit) {
        return res.status(404).json({
          message: "Unit not found",
        });
      }

      if ((status === "ON_LOAN") !== (existingUnit.status === "ON_LOAN")) {
        return res.status(409).json({
          message: "On-loan status can only be changed through loans",
        });
      }

      const unit = await prisma.equipmentUnit.update({
        where: { id },
        data: {
          identifier: identifier.trim().toUpperCase(),
          location: location.trim(),
          condition: condition.trim(),
          status,
        },
      });

      return res.json(unit);
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({
          message: "Unit not found",
        });
      }

      if (error.code === "P2002") {
        return res.status(409).json({
          message: "A unit with this identifier already exists",
        });
      }

      console.error(error);

      return res.status(500).json({
        message: "Unable to update unit",
      });
    }
  },
);

app.get("/api/loans/mine", requireAuth, async (req, res) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { borrowerId: req.session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        equipment: { select: { name: true } },
        equipmentUnit: { select: { identifier: true, location: true } },
      },
    });

    return res.json(loans);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to load loans",
    });
  }
});

app.post("/api/loans", requireAuth, async (req, res) => {
  const { equipmentUnitId, startDate, endDate } = req.body;

  const parsedUnitId = Number(equipmentUnitId);
  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (
    !Number.isInteger(parsedUnitId) ||
    !startDate ||
    !endDate ||
    Number.isNaN(parsedStartDate.getTime()) ||
    Number.isNaN(parsedEndDate.getTime())
  ) {
    return res.status(400).json({
      message: "Valid unit and borrowing period are required",
    });
  }

  const today = new Date(new Date().toISOString().slice(0, 10));

  if (parsedStartDate < today) {
    return res.status(400).json({
      message: "Start date cannot be in the past",
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
    const unit = await prisma.equipmentUnit.findUnique({
      where: { id: parsedUnitId },
    });

    if (!unit) {
      return res.status(404).json({
        message: "Unit not found",
      });
    }

    if (unit.status !== "AVAILABLE") {
      return res.status(409).json({
        message: "This unit is not available",
      });
    }

    const existingRequest = await prisma.loan.findFirst({
      where: {
        equipmentUnitId: unit.id,
        borrowerId: req.session.user.id,
        approvalStatus: "PENDING",
      },
    });

    if (existingRequest) {
      return res.status(409).json({
        message: "You already have a pending request for this unit",
      });
    }

    const loan = await prisma.loan.create({
      data: {
        equipmentId: unit.equipmentId,
        equipmentUnitId: unit.id,
        borrowerId: req.session.user.id,
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        approvalStatus: "PENDING",
        loanStatus: "REQUESTED",
      },
    });

    return res.status(201).json(loan);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Unable to submit loan request",
    });
  }
});

app.get(
  "/api/loan-requests",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    try {
      const loans = await prisma.loan.findMany({
        where: { approvalStatus: "PENDING" },
        orderBy: { createdAt: "asc" },
        include: {
          equipment: { select: { name: true } },
          equipmentUnit: {
            select: { identifier: true, location: true, status: true },
          },
          borrower: { select: { username: true } },
        },
      });

      return res.json(loans);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Unable to load loan requests",
      });
    }
  },
);

class LoanDecisionError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function findPendingLoan(transaction, id) {
  const loan = await transaction.loan.findUnique({ where: { id } });

  if (!loan) {
    throw new LoanDecisionError(404, "Loan request not found");
  }

  if (loan.approvalStatus !== "PENDING") {
    throw new LoanDecisionError(409, "This request has already been decided");
  }

  return loan;
}

function sendLoanDecisionError(res, error, fallbackMessage) {
  if (error instanceof LoanDecisionError) {
    return res.status(error.status).json({ message: error.message });
  }

  console.error(error);

  return res.status(500).json({ message: fallbackMessage });
}

app.post(
  "/api/loans/:id/approve",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Valid loan ID is required",
      });
    }

    try {
      const loan = await prisma.$transaction(async (transaction) => {
        const pendingLoan = await findPendingLoan(transaction, id);

        if (!pendingLoan.equipmentUnitId) {
          throw new LoanDecisionError(409, "This request has no unit");
        }

        const unitUpdate = await transaction.equipmentUnit.updateMany({
          where: { id: pendingLoan.equipmentUnitId, status: "AVAILABLE" },
          data: { status: "ON_LOAN" },
        });

        if (unitUpdate.count === 0) {
          throw new LoanDecisionError(409, "This unit is no longer available");
        }

        const loanUpdate = await transaction.loan.updateMany({
          where: { id, approvalStatus: "PENDING" },
          data: { approvalStatus: "APPROVED", loanStatus: "ACTIVE" },
        });

        if (loanUpdate.count === 0) {
          throw new LoanDecisionError(
            409,
            "This request has already been decided",
          );
        }

        return transaction.loan.findUnique({ where: { id } });
      });

      return res.json(loan);
    } catch (error) {
      return sendLoanDecisionError(res, error, "Unable to approve loan");
    }
  },
);

app.post(
  "/api/loans/:id/reject",
  requireAuth,
  requireGuideManager,
  async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Valid loan ID is required",
      });
    }

    try {
      const loan = await prisma.$transaction(async (transaction) => {
        await findPendingLoan(transaction, id);

        const loanUpdate = await transaction.loan.updateMany({
          where: { id, approvalStatus: "PENDING" },
          data: { approvalStatus: "REJECTED" },
        });

        if (loanUpdate.count === 0) {
          throw new LoanDecisionError(
            409,
            "This request has already been decided",
          );
        }

        return transaction.loan.findUnique({ where: { id } });
      });

      return res.json(loan);
    } catch (error) {
      return sendLoanDecisionError(res, error, "Unable to reject loan");
    }
  },
);

app.post("/api/loans/:id/return", requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({
      message: "Valid loan ID is required",
    });
  }

  try {
    const loan = await prisma.$transaction(async (transaction) => {
      const activeLoan = await transaction.loan.findUnique({ where: { id } });

      if (!activeLoan) {
        throw new LoanDecisionError(404, "Loan not found");
      }

      if (activeLoan.borrowerId !== req.session.user.id) {
        throw new LoanDecisionError(
          403,
          "Only the borrower can return this loan",
        );
      }

      const loanUpdate = await transaction.loan.updateMany({
        where: { id, loanStatus: "ACTIVE" },
        data: { loanStatus: "RETURNED", returnedAt: new Date() },
      });

      if (loanUpdate.count === 0) {
        throw new LoanDecisionError(409, "Only active loans can be returned");
      }

      if (activeLoan.equipmentUnitId) {
        await transaction.equipmentUnit.updateMany({
          where: { id: activeLoan.equipmentUnitId, status: "ON_LOAN" },
          data: { status: "AVAILABLE" },
        });
      }

      return transaction.loan.findUnique({ where: { id } });
    });

    return res.json(loan);
  } catch (error) {
    return sendLoanDecisionError(res, error, "Unable to return loan");
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
