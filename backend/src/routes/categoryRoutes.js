const express = require('express');
const { createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { authenticate } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authenticate, createCategory);
router.get('/', getAllCategory);
router.get('/:category_id', getCategoryById);
router.put('/:category_id', updateCategory);
router.delete('/:category_id', deleteCategory);

module.exports = router;