const { generateUniqueVillageId } = require("../middlewares/villageValidator")
const db = require('../config/db');

const createVillage =  async (village) => {
    const village_id = await generateUniqueVillageId();
    const [inserted] = await db('village')
      .insert({
        village_id: village_id,
        village_name: village.village_name,
        district: village.district,
        regency: village.regency,
        province: village.province,
        postal_code: village.postal_code,
        location_id: village.location_id
      })
      .returning('*');
    return inserted;
}

module.exports = {
    createVillage,
}