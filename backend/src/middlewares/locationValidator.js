const db = require('../config/db');

const generateUniqueLocationId = async () => {
    let unique = false;
    let locationId;

    while (!unique) {
        locationId = Math.floor(1000 + Math.random() * 9000);
        const found = await db('location').where({location_id: locationId}).first();
        if (!found) unique = true;
    }

    return locationId;
}

module.exports = {generateUniqueLocationId}