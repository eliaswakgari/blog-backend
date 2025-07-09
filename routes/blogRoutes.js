const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const auth = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.get("/", blogController.getBlogs);
router.get("/:slug", blogController.getBlog);
router.post("/", auth, upload.single("image"), blogController.createBlog);
router.put("/:id", auth, blogController.updateBlog);
router.delete("/:id", auth, blogController.deleteBlog);
router.post("/:id/like", auth, blogController.likeBlog);
router.post("/:id/bookmark", auth, blogController.bookmarkBlog);

module.exports = router;
