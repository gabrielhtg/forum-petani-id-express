// controllers/UserController.js

const express = require("express");
const { getAll, create, getById, removeUser, updateUser } = require("../service/UserService"); // Pastikan import updateUser
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");


router.get("/",authMiddleware, getAll);
router.post("/", create);
router.get("/:id",authMiddleware, getById);
router.delete("/:id",authMiddleware, removeUser);
router.put("/:id",authMiddleware, updateUser);

module.exports = router;
