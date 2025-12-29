const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    req.user = await User.findById(decoded.id).select("_id email");

    if (!req.user)
      return res.status(401).json({ message: "User no longer exists" });

    next();
  } catch (err) {
    console.error("JWT ERROR:", err);
    res.status(401).json({ message: "Invalid token" });
  }
};
