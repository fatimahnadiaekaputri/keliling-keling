const express = require('express');
const { createUMKM, getAllUMKM, getUMKMById } = require('../controllers/umkmController');
const { authenticate } = require('../middlewares/authMiddleware');
const { uploadImageUMKM } = require('../controllers/mediaController');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post('/', authenticate, createUMKM);
router.get('/', getAllUMKM);
router.get('/:business_id', getUMKMById);
router.post('/upload', authenticate, upload.array('images', 3), uploadImageUMKM);

module.exports = router;