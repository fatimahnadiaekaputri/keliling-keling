const express = require('express');
const { createUMKM, getAllUMKM, getUMKMById, updateUMKM, deleteUMKM, searchByVillageController } = require('../controllers/umkmController');
const { authenticate } = require('../middlewares/authMiddleware');
const { uploadImageUMKM } = require('../controllers/mediaController');
const upload = require('../middlewares/upload');
const router = express.Router();

router.post('/', authenticate, createUMKM); // static
router.post('/upload', authenticate, upload.array('images', 3), uploadImageUMKM); // static
router.get('/search', searchByVillageController); // static
router.get('/', getAllUMKM); // static
router.get('/:business_id', getUMKMById); // dynamic, harus paling bawah
router.put('/:business_id', authenticate, updateUMKM); // dynamic
router.delete('/:business_id', authenticate, deleteUMKM); // dynamic




module.exports = router;