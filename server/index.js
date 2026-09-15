require("dotenv").config();

const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");

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

app.listen(PORT, () => {
  console.log(`LEKH server running on http://localhost:${PORT}`);
});
