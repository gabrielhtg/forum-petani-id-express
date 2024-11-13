const express = require("express");
const {getAll, create, getById, removeUser} = require("../service/UserService");
const router = express.Router();

// Endpoint untuk mendapatkan semua user
router.get("/", getAll);
router.post("/", create);
router.get("/:id", getById);
router.delete("/:id", removeUser);

module.exports = router;
