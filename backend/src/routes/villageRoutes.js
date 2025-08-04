const express = require('express');
const { createVillage, getAllVillage, getVillageById, updateVillage, deleteVillage } = require('../controllers/villageController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createVillage);
router.get('/', getAllVillage);
router.get('/:village_id', getVillageById);
router.put('/:village_id', updateVillage);
router.delete('/:village_id', authenticate, deleteVillage);

module.exports = router;