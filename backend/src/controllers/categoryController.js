const categoryModel = require('../models/categoryModel');

const createCategory = async (req, res, next) => {
    try {
        const {category_name, description} = req.body;

        const categoryData = {category_name, description};
        const categoryInserted = await categoryModel.createCategory(categoryData);

        res.status(201).json({
            message: 'Category berhasil dibuat',
            data: {
                category: categoryInserted
            },
        });
    } catch (error) {
        console.error('Create category error', error);
        res.status(500).json({
            message: 'Gagal membuat category',
            error: error.message
        });
    }
}

module.exports = {createCategory}