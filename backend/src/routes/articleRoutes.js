const express = require('express');
const router = express.Router();
const {addArticle, getAllArticles, getArticleByUser, getArticleByIdForUser, updateArticle, deleteArticle} = require('../controllers/articleController');
const {authenticate} = require('../middlewares/authMiddleware');
const {validateArticle} = require('../middlewares/articleValidator');
const upload = require('../middlewares/upload');
const {uploadImage, deleteImage} = require('../controllers/mediaController');

router.post('/', authenticate, validateArticle, addArticle);
router.post('/upload', authenticate, upload.single('image'), uploadImage);
router.delete('/upload', authenticate, deleteImage);
router.get('/', getAllArticles);
router.get('/me', authenticate, getArticleByUser);
router.get('/:article_id', authenticate, getArticleByIdForUser);
router.put('/:article_id', authenticate, updateArticle);
router.delete('/:article_id', authenticate, deleteArticle);

module.exports = router;