const locationModel = require('../models/locationModel');
const tourismModel = require('../models/tourismModel');

const createTourism = async (req, res, next) => {
    try {
        const {
            location_name,
            latitude,
            longitude,
            address,
            tourism_name,
            description,
            facility,
            ticket_fee,
            village_id,
            photos
        } = req.body;

        const created_by = req.user?.user_id;
        if (!created_by) {
          return res.status(401).json({ message: 'Unauthorized: missing user context' });
        }

        const locationData = {
            location_name,
            latitude,
            longitude,
            address,
          };
          const locationInserted = await locationModel.createLocation(locationData);

          const tourismData = {
            tourism_name,
            description,
            facility,
            ticket_fee,
            location_id: locationInserted.location_id,
            village_id,
            created_by,
            photos
          };

          const tourismInserted = await tourismModel.createTourism(tourismData);

          res.status(201).json({
            message: 'Data pariwisata berhasil dibuat',
            data: {
              location: locationInserted,
              tourism: tourismInserted
            },
          });
    } catch (error) {
        console.error('create tourism error:', error);
        res.status(500).json({
          message: 'Gagal membuat pariwisata',
          error: error.message,
        });
    }
}

const getAllTourism = async (req, res) => {
    try {
        const tourism = await tourismModel.getAllTourism();
        res.json(tourism);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data'})
    }
}

const getTourismById = async (req, res) => {
    try {
        const {tourism_id} = req.params;
        const tourism = await tourismModel.findTourismById(tourism_id);

        if(!tourism) {
            return res.status(404).json({message: "tourism not found"})
        }
        res.json(tourism);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data umkm'})
    }
}

module.exports = {createTourism, getAllTourism, getTourismById};