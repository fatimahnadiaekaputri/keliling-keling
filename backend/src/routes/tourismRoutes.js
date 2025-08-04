const express = require('express');
const { authenticate } = require('../middlewares/authMiddleware');
const { createTourism, getAllTourism, getTourismById, updateTourism, deleteTourism, searchTourismByVillageController } = require('../controllers/tourismController');
const upload = require('../middlewares/upload');
const { uploadImageTourism } = require('../controllers/mediaController');
const router = express.Router();

router.post('/', authenticate, createTourism); // static
router.post('/upload', authenticate, upload.array('images', 5), uploadImageTourism); // static
router.get('/search', searchTourismByVillageController); // static
router.get('/', getAllTourism); // static
router.get('/:tourism_id', getTourismById); // dynamic
router.put('/:tourism_id', authenticate, updateTourism); // dynamic
router.delete('/:tourism_id', authenticate, deleteTourism); // dynamic

module.exports = router;