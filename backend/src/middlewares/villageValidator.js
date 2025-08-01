const db = require('../config/db')

const generateUniqueVillageId = async () => {
    let unique = false;
    let villageId;

    while (!unique) {
        villageId = Math.floor(1000 + Math.random() * 9000);
        const found = await db('village').where({village_id: villageId}).first();
        if (!found) unique = true;
    }

    return villageId;
}

module.exports = {generateUniqueVillageId}