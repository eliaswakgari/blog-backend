const Comment = require("../models/Comment");


exports.createComment = async (req, res) => {
  try {
    const { content, blogId } = req.body;
    const comment = new Comment({ content, blog: blogId, author: req.user.id });
    await comment.save();
    res.status(201).json({comment:comment,message:"Comment created successfully"});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.getComments = async (req, res) => {
  try {
    const { blogId } = req.query;
    const query = blogId ? { blog: blogId } : {};
    const comments = await Comment.find(query).populate("author", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    comment.content = req.body.content;
    comment.edited = true;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
