const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const auth = require("../middlewares/authMiddleware");

router.get("/", commentController.getComments);
router.post("/", auth, commentController.createComment);
router.put("/:id", auth, commentController.updateComment);
router.delete("/:id", auth, commentController.deleteComment);

module.exports = router;
