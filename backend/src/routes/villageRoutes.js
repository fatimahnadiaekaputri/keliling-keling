const express = require('express');
const { createVillage } = require('../controllers/villageController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createVillage);

module.exports = router;