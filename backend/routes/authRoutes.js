const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const user = await User.create(req.body);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(400).json({ message: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN REQUEST:", req.body.email);

    const user = await User.findOne({ email: req.body.email });

    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET logged-in user info
router.get("/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("_id email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("USER INFO ERROR:", err);
    res.status(500).json({ message: "Error fetching user info" });
  }
});

module.exports = router;
