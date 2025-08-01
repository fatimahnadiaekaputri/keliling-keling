const locationModel = require('../models/locationModel');
const umkmModel = require('../models/umkmModel');

const createUMKM = async (req, res, next) => {
    try {
        const {
          location_name,
          latitude,
          longitude,
          address,
          business_name,
          description,
          category_id,
          village_id,
          price,
          owner,
          photos
        } = req.body;

        const created_by = req.user?.user_id;
        if (!created_by) {
          return res.status(401).json({ message: 'Unauthorized: missing user context' });
        }
    
        // 1. Insert location dulu
        const locationData = {
          location_name,
          latitude,
          longitude,
          address,
        };
        const locationInserted = await locationModel.createLocation(locationData);
    
        // 2. Insert business dengan location_id hasil insert location
        const umkmData = {
          business_name,
          description,
          location_id: locationInserted.location_id,
          category_id,
          village_id,
          price,
          owner,
          created_by,
          photos
        };
    
        const businessInserted = await umkmModel.createUMKM(umkmData);
    
        res.status(201).json({
          message: 'UMKM dan lokasi berhasil dibuat',
          data: {
            location: locationInserted,
            business: businessInserted,
          },
        });
      } catch (error) {
        console.error('createUMKMWithLocation error:', error);
        res.status(500).json({
          message: 'Gagal membuat UMKM dan lokasi',
          error: error.message,
        });
      }
}

const getAllUMKM =  async (req, res) => {
   try {
    const umkm = await umkmModel.getAllUMKM();
    res.json(umkm);
   } catch (error) {
    res.status(500).json({error: 'Failed to fetch data'})
   }
}

const getUMKMById = async (req, res) => {
    try {
        const {business_id} = req.params;
        const umkm = await umkmModel.findUMKMById(business_id);

        if(!umkm) {
            return res.status(404).json({message: "umkm not found"})
        }
        res.json(umkm);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data umkm'})
    }
}
module.exports = {createUMKM, getAllUMKM, getUMKMById}