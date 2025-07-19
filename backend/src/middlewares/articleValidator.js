const db = require('../config/db');

const generateUniqueArticleId = async () => {
    let unique = false;
    let articleId;

    while (!unique) {
        articleId = Math.floor(1000 + Math.random() * 9000);
        const found = await db('article').where({article_id: articleId}).first();
        if (!found) unique = true;
    }

    return articleId
};

const validateArticle = (req, res, next) => {
    const { title, content, photo } = req.body;

    if (!title || !content || !photo) {
        return res.status(400).json({ message: 'Semua field (title, content, photo) wajib diisi' });
    }

    if (title.length > 255) {
        return res.status(400).json({ message: 'Judul tidak boleh lebih dari 255 karakter' });
    }

    const wordCount = content.trim().split(/\s+/).length;
    const maxWords = 500;
    if (wordCount > maxWords) {
        return res.status(400).json({ message: `Konten tidak boleh lebih dari ${maxWords} kata` });
    }

    next();
};

module.exports = {generateUniqueArticleId, validateArticle};