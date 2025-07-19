const db = require('../config/db');

const createArticle = async (article) => {
    return await db('article').insert(article); //post article
};

const findArticleById = async (article_id) => {
    return db('article').where({article_id: article_id}).first(); //get article by id
};

const getAllArticles = async () => {
    return db('article').select('*');
};

const getArticleByUserId = async (user_id) => {
    return db('article').where({user_id});
}

const getArticleByUserIdAndArticleId = async (user_id, article_id) => {
    return db('article').where({user_id, article_id}).first();
};

const updateArticleById = async (user_id, article_id, data) => {
    return db('article').where({article_id, user_id}).update(data).returning('*');
};

const deleteArticleById = async (user_id, article_id) => {
    return db('article').where({article_id, user_id}).del();
};

module.exports = {
    createArticle, findArticleById, getAllArticles, getArticleByUserId,
    getArticleByUserIdAndArticleId, updateArticleById, deleteArticleById
}
