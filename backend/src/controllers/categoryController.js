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

const getAllCategory = async (req, res) => {
    try {
        const category = await categoryModel.getAllCategory();
        res.json(category);
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch data'});
    }
}

const getCategoryById = async (req, res) => {
    try {
        const {category_id} = req.params;
        const category = await categoryModel.findCategoryById(category_id);

        if (!category) {
            return res.status(404).json({message: "category not found"})
        } 
        res.json(category);
    } catch(error) {
        res.status(500).json({error: 'Failed to fetch data'});
    }
}

const updateCategory = async (req, res) => {
    try {
        const {category_id} = req.params;
        const data = req.body;

        if (!data || Object.keys(data).length === 0) {
            return res.status(400).json({ 
              error: "Tidak ada data yang dikirim untuk di-update." 
            });
          }
        
        const updated = await categoryModel.updateCategory(category_id, data);

        if (!updated || updated.length === 0) {
            return res.status(404).json({ 
              message: "Data category tidak ditemukan" 
            });
          }
      
          res.json({ message: 'Data category updated', category: updated[0] });
    } catch (error) {
        res.status(500).json({ 
          error: 'Failed to update data category', 
          detail: error.message 
        });
      }
}

const deleteCategory = async (req, res) => {
    try {
        const {category_id} = req.params;
        const deleted = await categoryModel.deleteCategory(category_id);

        if (deleted === 0) {
            return res.status(404).json({message: "Data category tidak ditemukan"});
          }
      
          res.json({message: 'Data category berhasil dihapus'})
    } catch (error) {
        res.status(500).json({error: 'Failed to delete data UMKM'})
      } 
}
module.exports = {createCategory, getAllCategory, getCategoryById, updateCategory, deleteCategory}