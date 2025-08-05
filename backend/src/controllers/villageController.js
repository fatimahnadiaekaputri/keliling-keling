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

      const existingVillage = await villageModel.getVillageById(village_id);
    if (!existingVillage) {
      return res.status(404).json({ 
        message: "Data desa tidak ditemukan" 
      });
    }
      
      const villageFields = [
        'village_name', 'description', 'district', 'regency',
        'photos', 'province', 'postal_code', 'location_id'
      ];
  
      const villageData = {};
      for (const key of villageFields) {
        if (key in data) villageData[key] = data[key];
      }
  
      let updatedVillage = [];
      if (Object.keys(villageData).length > 0) {
        updatedVillage = await villageModel.updateVillage(village_id, villageData);
      } else {
        updatedVillage = [existingVillage]; // fallback ke data lama kalau bisnis gak diubah
      }
  
      // 3. Update tabel location (kalau ada field yang dikirim)
      const locationFields = ['latitude', 'longitude', 'address', 'location_name'];
      const locationData = {};
      for (const key of locationFields) {
        if (key in data) locationData[key] = data[key];
      }
  
      let updatedLocation = null;
      if (Object.keys(locationData).length > 0) {
        updatedLocation = await locationModel.updateLocation(existingVillage.location_id, locationData);
      }
  
      res.json({ 
        message: 'Data desa berhasil di-update',
        village: updatedVillage[0],
        ...(updatedLocation && { location: updatedLocation[0] })
      });
    } catch (error) {
        res.status(500).json({ 
          error: 'Failed to update data desa', 
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