const db = require('../config/db');
const { generateUniqueBusinessId } = require('../middlewares/umkmValidator');
const moment = require('moment-timezone')

const createUMKM = async (umkm) => {
    const business_id = await generateUniqueBusinessId();

    const jakartaTime = moment().tz('Asia/Jakarta').format('YYYY-MM-DD HH:mm:ss');
  
    const businessPayload = {
      business_id,
      business_name: umkm.business_name,
      description: umkm.description,
      location_id: umkm.location_id,
      category_id: umkm.category_id, // langsung di kolom business
      village_id: umkm.village_id,
      price: umkm.price,
      owner: umkm.owner,
      created_at: jakartaTime,
      created_by: umkm.created_by,
      photos: umkm.photos
    };
  
    const [inserted] = await db('business').insert(businessPayload).returning('*');
  
    return inserted;
}

const findUMKMById = async (business_id) => {
    return db('business')
      .select(
        'business.*',
        'village.village_name as village_name',
        'location.location_name',
        'location.latitude',
        'location.longitude',
        'location.address',
        'business_category.category_name',
        'business_category.description as category_description',
        'user.user_id as created_by_id',
        'user.name as created_by_name'
      )
      .leftJoin('village', 'business.village_id', 'village.village_id')
      .leftJoin('location', 'business.location_id', 'location.location_id')
      .leftJoin('business_category', 'business.category_id', 'business_category.category_id')
      .leftJoin('user', 'business.created_by', 'user.user_id')
      .where('business.business_id', business_id)
      .first(); // hanya ambil satu hasil
  };
  

const getAllUMKM = async () => {
    return db('business')
      .select(
        'business.*',
        'village.village_name as village_name',
        // location fields (boleh sesuaikan kalau kolomnya berbeda)
        'location.location_name',
        'location.latitude',
        'location.longitude',
        'location.address',
        // category master
        'business_category.category_name',
        'business_category.description as category_description',
        // creator user
        'user.user_id as created_by_id',
        'user.name as created_by_name',
      )
      .leftJoin('village', 'business.village_id', 'village.village_id')
      .leftJoin('location', 'business.location_id', 'location.location_id')
      .leftJoin(
        'business_category',
        'business.category_id',
        'business_category.category_id'
      )
      .leftJoin('user', 'business.created_by', 'user.user_id');
  };
  

const updateUMKM = async (business_id, data) => {
    return db('business').where({business_id}).update(data).returning('*');
}

const deleteUMKM = async (business_id) => {
    return db('business').where({business_id}).del();
}

module.exports = {
    createUMKM, findUMKMById, getAllUMKM, updateUMKM, deleteUMKM
}