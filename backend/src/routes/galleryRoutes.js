const express = require("express");
const multer = require("multer");
const { uploadImageGallery, deleteImage } = require("../controllers/mediaController");
const { listGalleryImages } = require("../controllers/galleryController");
const upload = multer();

const router = express.Router();

router.post("/upload", upload.array("files"), uploadImageGallery);
router.get("/list", listGalleryImages);
router.delete("/delete", express.json(), deleteImage);

module.exports = router;
