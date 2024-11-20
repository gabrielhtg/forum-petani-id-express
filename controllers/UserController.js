// controllers/UserController.js

const express = require("express");
const { getAll, create, getById, removeUser, updateUser } = require("../service/UserService"); // Pastikan import updateUser
const router = express.Router();


router.get("/", getAll);
router.post("/", create);
router.get("/:id", getById);
router.delete("/:id", removeUser);
router.put("/:id", updateUser); 

module.exports = router;
