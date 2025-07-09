const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = null;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    // Check if user is banned
    const User = require("../models/User");
    User.findById(decoded.id)
      .then((user) => {
        if (!user || user.isBanned) {
          return res.status(403).json({ error: "Your account is banned." });
        }
        next();
      })
      .catch(() => res.status(403).json({ error: "Your account is banned." }));
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};
