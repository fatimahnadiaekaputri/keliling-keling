const { generateUniqueTourismId } = require("../middlewares/tourismValidator")
const moment = require('moment-timezone')
const db = require('../config/db')

const createTourism = async (tourism) => {
    const tourism_id = await generateUniqueTourismId();
    const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');

    const tourismPayload = {
        tourism_id,
        tourism_name: tourism.tourism_name,
        description: tourism.description,
        facility: tourism.facility,
        ticket_fee: tourism.ticket_fee,
        location_id: tourism.location_id,
        village_id: tourism.village_id,
        created_by: tourism.created_by,
        created_at: jakartaTime,
        photos: tourism.photos,
        link: tourism.link
    };

    const [inserted] = await db('tourism').insert(tourismPayload).returning('*');

    return inserted;
}

const getAllTourism = async () => {
    return db('tourism')
      .select(
        'tourism.*',
        'village.village_name as village_name',
        'location.location_name',
        'location.latitude',
        'location.longitude',
        'location.address',
        'user.user_id as created_by_id',
        'user.name as created_by_name',
      )
      .leftJoin('village', 'tourism.village_id', 'village.village_id')
      .leftJoin('location', 'tourism.location_id', 'location.location_id')
      .leftJoin('user', 'tourism.created_by', 'user.user_id')
};

const findTourismById = async (tourism_id) => {
    return db('tourism')
      .select(
        'tourism.*',
        'village.village_name as village_name',
        'location.location_name',
        'location.latitude',
        'location.longitude',
        'location.address',
        'user.user_id as created_by_id',
        'user.name as created_by_name',
      )
      .leftJoin('village', 'tourism.village_id', 'village.village_id')
      .leftJoin('location', 'tourism.location_id', 'location.location_id')
      .leftJoin('user', 'tourism.created_by', 'user.user_id')
      .where('tourism.tourism_id', tourism_id)
      .first();
}

const searchTourismByVillage = async (term, limit = 100) => {
  const q = String(term).trim().toLowerCase()

  const query = db("tourism")
    .select(
      "tourism.*",
      "village.village_name as village_name",
      "location.location_name",
      "location.latitude",
      "location.longitude",
      "location.address",
      "u.user_id as created_by_id",
      "u.name as created_by_name"
    )
    .leftJoin("village", "tourism.village_id", "village.village_id")
    .leftJoin("location", "tourism.location_id", "location.location_id")
    .leftJoin("user as u", "tourism.created_by", "u.user_id") // alias user jadi u

  if (q) {
    query.where(function () {
      this.whereRaw(
        "LOWER(REPLACE(village.village_name, 'desa ', '')) LIKE ?",
        [`%${q.replace(/^desa\s+/i, "")}%`]
      ).orWhereRaw(
        "LOWER(village.village_name) LIKE ?",
        [`%${q}%`]
      )
    })
  }

  query.orderBy("tourism.tourism_name").limit(limit)

  try {
    const results = await query
    return results
  } catch (error) {
    throw error
  }
}

const updateTourism = async (created_by, tourism_id, data) => {
  return db('tourism').where({tourism_id, created_by}).update(data).returning('*');
};

const deleteTourism = async (created_by, tourism_id) => {
  return db('tourism').where({tourism_id, created_by}).del();
}


module.exports = {createTourism, getAllTourism, findTourismById, updateTourism, deleteTourism, searchTourismByVillage};