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
        location_id: village.location_id,
        description: village.description,
        created_by: village.created_by
      })
      .returning('*');
    return inserted;
}

const getAllVillage = async () => {
  return db('village')
  .select(
    'village.*',
    'location.location_name',
    'location.latitude',
    'location.longitude',
    'location.address',
    // creator user
    'user.user_id as created_by_id',
    'user.name as created_by_name',
  )
  .leftJoin('location', 'village.location_id', 'location.location_id')
  .leftJoin('user', 'village.created_by', 'user.user_id');
}

const findVillageById = async (village_id) => {
  return db('village')
  .select(
    'village.*',
    'location.location_name',
    'location.latitude',
    'location.longitude',
    'location.address',
    'user.user_id as created_by_id',
    'user.name as created_by_name',
  )
  .leftJoin('location', 'village.location_id', 'location.location_id')
  .leftJoin('user', 'village.created_by', 'user.user_id')
  .where('village.village_id', village_id)
  .first();
}

const updateVillage = async (village_id, data) => {
  return db('village').where({village_id}).update(data).returning('*');
}

const deleteVillage = async (created_by, village_id) => {
  return db('village').where({created_by, village_id}).del();
}

module.exports = {
    createVillage, getAllVillage, findVillageById, updateVillage, deleteVillage
}