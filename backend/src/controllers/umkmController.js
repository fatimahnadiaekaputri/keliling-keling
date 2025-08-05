const locationModel = require('../models/locationModel');
const umkmModel = require('../models/umkmModel');

const createUMKM = async (req, res, next) => {
    try {
        const {
          latitude,
          longitude,
          address,
          business_name,
          description,
          category_id,
          village_id,
          price,
          owner,
          photos,
          link,
          business_telephone
        } = req.body;

        const created_by = req.user?.user_id;
        if (!created_by) {
          return res.status(401).json({ message: 'Unauthorized: missing user context' });
        }

       // buat location_name otomatis dari business_name (dengan prefix "lokasi")
        let location_name = `lokasi ${business_name ?? ""}`.trim().replace(/\s+/g, " ")

// jika mau sertakan address juga, misal: "lokasi NamaUsaha, Alamat"
        if (address) {
            location_name = `lokasi ${business_name ?? ""}, ${address}`.trim().replace(/\s+/g, " ")
        }

// batasi panjang
        if (location_name.length > 100) {
            location_name = location_name.slice(0, 100)
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
          photos,
          link,
          business_telephone
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

const searchByVillageController = async (req, res) => {
  try {
    const rawTerm = req.query.village ?? req.query.village_name ?? ""
    const villageTerm = String(rawTerm).trim()
    const limit = parseInt(req.query.limit, 10) || 100

    const umkm = await umkmModel.searchUMKMByVillage(villageTerm, limit)

    if (umkm.length === 0) {
      return res.status(200).json({
        message: "Tidak ditemukan UMKM untuk desa tersebut",
        data: [],
      })
    }
    res.status(200).json(umkm)

  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch data umkm",
      message: error.message || "Internal Server Error",
    })
  }
}


const updateUMKM = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { business_id } = req.params;
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ 
        error: "Tidak ada data yang dikirim untuk di-update." 
      });
    }

    // 1. Cek apakah bisnisnya ada dan dimiliki oleh user
    const existingBusiness = await umkmModel.getBusinessByIdAndUser(business_id, user_id);
    if (!existingBusiness) {
      return res.status(404).json({ 
        message: "Data UMKM tidak ditemukan atau tidak ditulis oleh user" 
      });
    }

    // 2. Update tabel business
    const businessFields = [
      'business_name', 'description', 'category_id', 'village_id', 'price',
      'owner', 'photos', 'link', 'business_telephone'
    ];

    const businessData = {};
    for (const key of businessFields) {
      if (key in data) businessData[key] = data[key];
    }

    let updatedBusiness = [];
    if (Object.keys(businessData).length > 0) {
      updatedBusiness = await umkmModel.updateUMKM(user_id, business_id, businessData);
    } else {
      updatedBusiness = [existingBusiness]; // fallback ke data lama kalau bisnis gak diubah
    }

    // 3. Update tabel location (kalau ada field yang dikirim)
    const locationFields = ['latitude', 'longitude', 'address', 'location_name'];
    const locationData = {};
    for (const key of locationFields) {
      if (key in data) locationData[key] = data[key];
    }

    let updatedLocation = null;
    if (Object.keys(locationData).length > 0) {
      updatedLocation = await locationModel.updateLocation(existingBusiness.location_id, locationData);
    }

    res.json({ 
      message: 'Data UMKM berhasil di-update',
      business: updatedBusiness[0],
      ...(updatedLocation && { location: updatedLocation[0] })
    });

  } catch (error) {
    console.error('updateUMKM error:', error);
    res.status(500).json({ 
      error: 'Gagal mengupdate data UMKM', 
      detail: error.message 
    });
  }
};


const deleteUMKM = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {business_id} = req.params;

    const deleted = await umkmModel.deleteUMKM(user_id, business_id);

    if (deleted === 0) {
      return res.status(404).json({message: "Data UMKM tidak ditemukan atau tidak ditulis oleh user"});
    }

    res.json({message: 'Data UMKM berhasil dihapus'})
  } catch (error) {
    res.status(500).json({error: 'Failed to delete data UMKM'})
  }  
} 
module.exports = {createUMKM, getAllUMKM, getUMKMById, updateUMKM, deleteUMKM, searchByVillageController}