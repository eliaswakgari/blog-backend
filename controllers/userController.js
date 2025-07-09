// Analytics for admin dashboard
exports.analytics = async (req, res) => {
  try {
    const User = require("../models/User");
    const Blog = require("../models/Blog");
    const Comment = require("../models/Comment");
    const users = await User.countDocuments();
    const posts = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const activeUsers = await User.countDocuments({ isBanned: false });
    res.json({ users, posts, comments, activeUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changeRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["reader", "writer", "admin"].includes(role))
      return res.status(400).json({ error: "Invalid role" });
    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Ban or unban a user by code (set isBanned to true or false explicitly)
exports.banUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { ban } = req.body; // expects { ban: true } or { ban: false }
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    if (typeof ban !== "boolean") {
      return res
        .status(400)
        .json({ error: "Missing or invalid 'ban' boolean in request body." });
    }
    user.isBanned = ban;
    await user.save();
    res.json({ message: ban ? "User banned" : "User unbanned" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
