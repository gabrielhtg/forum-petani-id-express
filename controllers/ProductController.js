const express = require("express");
const {
  getAll,
  create,
  getById,
  remove,
  update,
  getAllUploadedByMe,
} = require("../service/ProductService");
const router = express.Router();
const authMiddleware = require("../middleware/AuthMiddleware");
const upload = require("../middleware/UploadProductMiddleware");

router.get("/", getAll);
router.get("/sort/uploaded-by-me/:id", authMiddleware, getAllUploadedByMe);
router.post("/", upload.single("picture"), authMiddleware, create);
router.get("/:id", getById);
router.delete("/:id", authMiddleware, remove);
router.put("/:id", authMiddleware, update);

module.exports = router;
