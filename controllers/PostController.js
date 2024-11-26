const express = require("express");
const {
  getAll,
  create,
  getById,
  remove,
  update,
  getAllPicturesById,
  getAllSortedByLikes,
} = require("../service/PostService");
const authMiddleware = require("../middleware/AuthMiddleware");
const upload = require("../middleware/UploadPostPictureMiddleware");
const router = express.Router();

router.get("/", getAll);
router.get("/all/likes", getAllSortedByLikes);
router.get("/pictures/:id", getAllPicturesById);
router.post("/", upload.array("files", 10), authMiddleware, create);
router.get("/:id", authMiddleware, getById);
router.delete("/:id", authMiddleware, remove);
router.put("/:id", authMiddleware, update);

module.exports = router;
