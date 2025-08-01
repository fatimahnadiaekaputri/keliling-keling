const db = require('../config/db');
const { generateUniqueLocationId } = require('../middlewares/locationValidator');

const createLocation = async (location) => {
    const location_id = await generateUniqueLocationId();
    // location = { location_name, latitude?, longitude?, address }
    const [inserted] = await db('location')
      .insert({
        location_id: location_id,
        location_name: location.location_name,
        latitude: location.latitude || null,
        longitude: location.longitude || null,
        address: location.address,
      })
      .returning('*'); // ambil row lengkap hasil insert
  
    return inserted; // berisi location_id dan field lain
  };
  
  module.exports = {
    createLocation,
  };