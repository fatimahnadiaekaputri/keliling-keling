const db = require('../config/db')

const generateUniqueBusinessId = async () => {
    let unique = false;
    let businessId;
  
    while (!unique) {
      businessId = Math.floor(1000 + Math.random() * 9000); // 1000-9999
      const found = await db('business').where({ business_id: businessId }).first();
      if (!found) unique = true;
    }
  
    return businessId;
  };

  module.exports = {generateUniqueBusinessId}