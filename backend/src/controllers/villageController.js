const villageModel = require('../models/villageModel');
const locationModel = require('../models/locationModel');

const createVillage = async (req, res, next) => {
    try {

        const {
            latitude, 
            longitude,
            address,
            village_name,
            district,
            regency,
            province,
            postal_code,
            description
        } = req.body;

        const created_by = req.user?.user_id;
        if (!created_by) {
            return res.status(401).json({ message: 'Unauthorized: missing user context' });
          }

        // buat location_name otomatis dari business_name (dengan prefix "lokasi")
        let location_name = `lokasi ${village_name ?? ""}`.trim().replace(/\s+/g, " ")

// jika mau sertakan address juga, misal: "lokasi NamaUsaha, Alamat"
        if (address) {
            location_name = `lokasi ${village_name ?? ""}, ${address}`.trim().replace(/\s+/g, " ")
        }

// batasi panjang
        if (location_name.length > 100) {
            location_name = location_name.slice(0, 100)
        }

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
            description,
            created_by
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

const getAllVillage = async (req, res) => {
    try {
        const village = await villageModel.getAllVillage();
        res.json(village);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data'})
    }
}

const getVillageById = async (req, res) => {
    try {
        const {village_id} = req.params;
        const village = await villageModel.findVillageById(village_id);

        if (!village) {
            return res.status(404).json({message: "village not found"})
        } 
        res.json(village);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch data umkm'})
    }
}

const updateVillage = async (req, res) => {
    try {
        const {village_id} = req.params;
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ 
          error: "Tidak ada data yang dikirim untuk di-update." 
        });
      }
      
    const updated = await villageModel.updateVillage(village_id, data);

    if (!updated || updated.length === 0) {
        return res.status(404).json({ 
          message: "Data desa tidak ditemukan" 
        });
      }
  
      res.json({ message: 'Data desa updated', village: updated[0] });
    } catch (error) {
        res.status(500).json({ 
          error: 'Failed to update data UKKM', 
          detail: error.message 
        });
      }
}

const deleteVillage = async (req, res) => {
    try {
        const user_id = req.user.user_id;
        const {village_id} = req.params;
        
        const deleted = await villageModel.deleteVillage(user_id, village_id);

        if (deleted === 0) {
            return res.status(404).json({message: "Data desa tidak ditemukan atau tidak ditulis oleh user"});
          }
      
          res.json({message: 'Data desa berhasil dihapus'})
    } catch (error) {
        res.status(500).json({error: 'Failed to delete data UMKM'})
      } 
}


module.exports = {createVillage, getAllVillage, getVillageById, updateVillage, deleteVillage}