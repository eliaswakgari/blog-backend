const Blog = require("../models/Blog");
const slugify = require("slugify");
const User = require("../models/User");

exports.createBlog = async (req, res) => {
  try {
    const { title, content, tags, category, status, slug } = req.body;
    const blog = new Blog({
      title,
      slug: slug || slugify(title, { lower: true, strict: true }),
      content,
      author: req.user.id,
      image: req.file?.filename,
      tags,
      category,
      status: status || "draft",
    });
    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, tag, category, author } = req.query;
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (tag) query.tags = tag;
    if (category) query.category = category;
    if (author) query.author = author;
    query.status = "published";
    const blogs = await Blog.find(query)
      .populate("author", "username")
      .populate("comments")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Blog.countDocuments(query);
    res.json({ blogs, total });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "username")
      .populate({
        path: "comments",
        populate: { path: "author", select: "username" },
      });
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    Object.assign(blog, req.body);
    if (req.body.title)
      blog.slug = slugify(req.body.title, { lower: true, strict: true });
    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    if (blog.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }
    await blog.deleteOne();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    const userId = req.user.id;
    if (blog.likes.includes(userId)) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }
    await blog.save();
    res.json({ likes: blog.likes.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.bookmarkBlog = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const blogId = req.params.id;
    if (user.bookmarks.includes(blogId)) {
      user.bookmarks.pull(blogId);
    } else {
      user.bookmarks.push(blogId);
    }
    await user.save();
    res.json({ bookmarks: user.bookmarks });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
