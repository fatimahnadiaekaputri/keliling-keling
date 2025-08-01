const db = require('../config/db');
const { generateUniqueCategoryId } = require('../middlewares/categoryValidator');

const createCategory = async (category) => {
    const category_id = await generateUniqueCategoryId();
    const [inserted] = await db('business_category')
      .insert({
       category_id: category_id,
       category_name: category.category_name,
       description: category.description || null,
      })
      .returning('*');
    return inserted;
}

module.exports = {
    createCategory,
}