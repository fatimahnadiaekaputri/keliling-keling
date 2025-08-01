const db = require('../config/db')

const generateUniqueTourismId = async () => {
    let unique = false;
    let tourismId;
  
    while (!unique) {
      tourismId = Math.floor(1000 + Math.random() * 9000); // 1000-9999
      const found = await db('tourism').where({ tourism_id: tourismId }).first();
      if (!found) unique = true;
    }
  
    return tourismId;
  };

  module.exports = {generateUniqueTourismId}