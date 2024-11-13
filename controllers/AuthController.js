const express = require("express");
const router = express.Router();
const {login} = require("../service/AuthService");

// Endpoint untuk mendapatkan semua user
router.post("/login", login);

module.exports = router;