const villageModel = require('../models/villageModel');
const locationModel = require('../models/locationModel');

const createVillage = async (req, res, next) => {
    try {
        const {
            location_name,
            latitude, 
            longitude,
            address,
            village_name,
            district,
            regency,
            province,
            postal_code
        } = req.body;

        const locationData = {
            location_name,
            latitude,
            longitude,
            address,
          };
        const locationInserted = await locationModel.createLocation(locationData);

        const villageData = {
            village_name,
            district,
            regency,
            province,
            postal_code,
            location_id: locationInserted.location_id,
        }

        const villageInserted = await villageModel.createVillage(villageData);

        res.status(201).json({
            message: 'Data desa berhasil dibuat',
            data: {
                village: villageInserted,
                location: locationInserted
            },
        });
    } catch (error) {
        console.error('Create village error', error);
        res.status(500).json({
            message: "Gagal membuat data desa",
            error: error.message,
        });
    }
}

module.exports = {createVillage}