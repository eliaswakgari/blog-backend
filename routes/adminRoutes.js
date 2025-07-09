const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const auth = require("../middlewares/authMiddleware");
const role = require("../middlewares/roleMiddleware");
router.get("/analytics", auth, role(["admin"]), userController.analytics);
router.get("/users", auth, role(["admin"]), userController.getUsers);
router.patch(
  "/users/:id",
  auth,
  role(["admin"]),
  userController.changeRole
);
router.patch("/users/:id/ban", auth, role(["admin"]), userController.banUser);

module.exports = router;
