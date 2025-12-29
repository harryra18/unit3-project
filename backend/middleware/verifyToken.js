const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.user = await User.findById(decoded.id).select("_id email");

    next();
  } catch (err) {
    console.error("Verify token error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
