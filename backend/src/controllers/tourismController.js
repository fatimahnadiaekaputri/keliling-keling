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
            link,
            telephone
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
            link,
            telephone
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

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ 
        error: "Tidak ada data yang dikirim untuk di-update." 
      });
    }

    // 1. Cek apakah bisnisnya ada dan dimiliki oleh user
    const existingTourism = await tourismModel.getTourismByIdAndUser(tourism_id, user_id);
    if (!existingTourism) {
      return res.status(404).json({ 
        message: "Data Pariwisata tidak ditemukan atau tidak ditulis oleh user" 
      });
    }

    // 2. Update tabel business
    const tourismFields = [
      'tourism_name', 'description', 'facility', 'ticket_fee',
      'photos', 'link', 'telephone', "village_id"
    ];

    const tourismData = {};
    for (const key of tourismFields) {
      if (key in data) tourismData[key] = data[key];
    }

    let updatedTourism = [];
    if (Object.keys(tourismData).length > 0) {
      updatedTourism = await tourismModel.updateTourism(user_id, tourism_id, tourismData);
    } else {
      updatedTourism = [existingTourism]; // fallback ke data lama kalau bisnis gak diubah
    }

    // 3. Update tabel location (kalau ada field yang dikirim)
    const locationFields = ['latitude', 'longitude', 'address', 'location_name'];
    const locationData = {};
    for (const key of locationFields) {
      if (key in data) locationData[key] = data[key];
    }

    let updatedLocation = null;
    if (Object.keys(locationData).length > 0) {
      updatedLocation = await locationModel.updateLocation(existingTourism.location_id, locationData);
    }

    res.json({ 
      message: 'Data pariwisata berhasil di-update',
      tourism: updatedTourism[0],
      ...(updatedLocation && { location: updatedLocation[0] })
    });
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