const db = require('../config/db');
const { generateUniqueCategoryId } = require('../middlewares/categoryValidator');

const createCategory = async (category) => {
    const category_id = await generateUniqueCategoryId();
    const [inserted] = await db('business_category')
      .insert({
       category_id: category_id,
       category_name: category.category_name,
       description: category.description || null,
       created_by: category.created_by
      })
      .returning('*');
    return inserted;
}

const getAllCategory = async () => {
  return db('business_category')
  .select(
    'business_category.*',
    'user.user_id as created_by_id',
    'user.name as created_by_name',
  )
  .leftJoin('user', 'business_category.created_by', 'user.user_id');
}

const findCategoryById = async (category_id) => {
  return db('business_category')
  .select(
    'business_category.*',
    'user.user_id as created_by_id',
    'user.name as created_by_name',
  )
  .leftJoin('user', 'business_category.created_by', 'user.user_id')
  .where('business_category.category_id', category_id)
  .first();
}

const updateCategory = async (category_id, data) => {
  return db('business_category').where({category_id}).update(data).returning('*');
}

const deleteCategory = async (category_id) => {
  return db('business_category').where({category_id}).del();
}

module.exports = {
    createCategory, getAllCategory, findCategoryById, updateCategory, deleteCategory
}