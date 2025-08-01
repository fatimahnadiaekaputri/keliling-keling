const express = require('express');
const { createCategory } = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createCategory);

module.exports = router;