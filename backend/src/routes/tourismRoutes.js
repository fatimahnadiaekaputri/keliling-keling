const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { createTourism, getAllTourism, getTourismById } = require('../controllers/tourismController');
const upload = require('../middlewares/upload');
const { uploadImageTourism } = require('../controllers/mediaController');
const router = express.Router();

router.post('/', authenticate, createTourism);
router.get('/', getAllTourism);
router.get('/:tourism_id', getTourismById);
router.post('/upload', authenticate, upload.array('images', 5), uploadImageTourism);

module.exports = router;