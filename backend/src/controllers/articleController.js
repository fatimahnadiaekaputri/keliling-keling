const { v4: uuidv4 } = require('uuid');
const moment = require('moment-timezone');
const articleModel = require('../models/articleModel');
const {generateUniqueArticleId} = require('../middlewares/articleValidator');

const addArticle = async (req, res, next) => {
    try {
        const {title, content, photo} = req.body;
        const user_id = req.user.user_id;
        const article_id = await generateUniqueArticleId();

        const newArticle = {
            article_id,
            title,
            content,
            photo,
            user_id,
            timestamp: moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss')
        };

        await articleModel.createArticle(newArticle);
        res.status(201).json({message: 'Artikel is created', data: newArticle});
    } catch (err) {
        next(err);
    }
};

const getAllArticles = async (req, res) => {
    try {
        const articles = await articleModel.getAllArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch articles'})
    }
};

const getArticleByUser = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const articles = await articleModel.getArticleByUserId(user_id);
        res.json(articles);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch articles for user'});
    }
};

const getArticleByIdForUser = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {article_id} = req.params;
        const article = await articleModel.getArticleByUserIdAndArticleId(user_id, article_id);
        
        if (!article) {
            return res.status(404).json({message: 'Article not found'});
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch article'});
    }
};

const updateArticle = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {article_id} = req.params;
        const data = req.body;

        const updated = await articleModel.updateArticleById(user_id, article_id, data);

        if (updated.length === 0) {
            return res.status(404).json({message: 'Article not found or not owned by user'});
        }

        res.json({message: 'Article updated', article: updated[0]});
    } catch (error) {
        res.status(500).json({error: 'Failed to update article'});
    }
};

const deleteArticle = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {article_id} = req.params;

        const deleted = await articleModel.deleteArticleById(user_id, article_id);

        if (deleted === 0) {
            return res.status(404).json({message: 'Article not found or not owned by user'});
        }

        res.json({message: 'Article deleted successfully'});
    } catch (error) {
        res.status(500).json({error: 'Failed to delete article'});
    }
};


module.exports = { addArticle, getAllArticles, getArticleByUser, getArticleByIdForUser, 
    updateArticle, deleteArticle
 };