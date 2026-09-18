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

const testUser = {
  id: 1,
  username: "student",
  passwordHash: bcrypt.hashSync("password123", 10),
  role: "STUDENT",
};

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

  if (username !== testUser.username) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const passwordMatches = await bcrypt.compare(password, testUser.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  req.session.user = {
    id: testUser.id,
    username: testUser.username,
    role: testUser.role,
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
