const express = require("express");
const { getAll, create, getById, remove, update } = require("../service/ProductService"); // Pastikan import updateUser
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const upload = require("../middleware/UploadProductMiddleware");


router.get("/", authMiddleware, getAll);
router.post("/", upload.single('picture'), authMiddleware, create);
router.get("/:id", authMiddleware, getById);
router.delete("/:id",authMiddleware, remove);
router.put("/:id",authMiddleware, update);

module.exports = router;
