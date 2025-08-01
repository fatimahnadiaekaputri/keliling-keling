const db = require('../config/db')

const generateUniqueCategoryId = async () => {
    let unique = false;
    let categoryId;

    while (!unique) {
        categoryId = Math.floor(1000 + Math.random() * 9000);
        const found = await db('business_category').where({category_id: categoryId}).first();
        if (!found) unique = true;
    }

    return categoryId;
}

module.exports = {generateUniqueCategoryId}