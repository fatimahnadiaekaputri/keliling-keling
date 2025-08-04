const locationModel = require('../models/locationModel');
const tourismModel = require('../models/tourismModel');

const createTourism = async (req, res, next) => {
    try {
        const {
            latitude,
            longitude,
            address,
            tourism_name,
            description,
            facility,
            ticket_fee,
            village_id,
            photos,
            link
        } = req.body;

        const created_by = req.user?.user_id;
        if (!created_by) {
          return res.status(401).json({ message: 'Unauthorized: missing user context' });
        }

        // buat location_name otomatis dari business_name (dengan prefix "lokasi")
        let location_name = `lokasi ${tourism_name ?? ""}`.trim().replace(/\s+/g, " ")

// jika mau sertakan address juga, misal: "lokasi NamaUsaha, Alamat"
        if (address) {
            location_name = `lokasi ${tourism_name ?? ""}, ${address}`.trim().replace(/\s+/g, " ")
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

          const tourismData = {
            tourism_name,
            description,
            facility,
            ticket_fee,
            location_id: locationInserted.location_id,
            village_id,
            created_by,
            photos,
            link
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

const searchTourismByVillageController = async (req, res) => {
  try {
    const rawTerm = req.query.village ?? req.query.village_name ?? ""
    const villageTerm = String(rawTerm).trim()
    const limit = parseInt(req.query.limit, 10) || 100

    const umkm = await tourismModel.searchTourismByVillage(villageTerm, limit)

    if (umkm.length === 0) {
      return res.status(200).json({
        message: "Tidak ditemukan data pariwisata untuk desa tersebut",
        data: [],
      })
    }
    res.status(200).json(umkm)

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch data pariwisata",
      message: error.message || "Internal Server Error",
    })
  }
}

const updateTourism = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {tourism_id} = req.params;
    const data = req.body;

    const updated = await tourismModel.updateTourism(user_id, tourism_id, data);

    if (updated.length === 0) {
      return res.status(404).json({message: "Data Pariwisata tidak ditemukan atau tidak ditulis oleh user"});
    }

    res.json({message: 'Data Pariwisata berhasil diupdate', tourism: updated[0]});
  } catch (error) {
    console.error('Update data pariwisata error:', error);
    res.status(500).json({error: 'Failed to update data pariwisata', detail: error.message});
  }
}

const deleteTourism = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {tourism_id} = req.params;

    const deleted = await tourismModel.deleteTourism(user_id, tourism_id);

    if (deleted === 0) {
      return res.status(404).json({message: 'Data pariwisata tidak ditemukan atau tidak ditulis oleh user'});
    }

    res.json({message: 'Data pariwisata berhasil dihapus'});
  } catch (error) {
    res.status(500).json({error: 'Failed to delete data pariwisata'})
  }
}

module.exports = {createTourism, getAllTourism, getTourismById, updateTourism, deleteTourism, searchTourismByVillageController};