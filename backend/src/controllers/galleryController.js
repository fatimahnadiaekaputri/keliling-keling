const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const listGalleryImages = async (req, res, next) => {
    try {
      const folder = "galery_keliling_keling";
  
      // List images di folder tertentu
      const result = await cloudinary.api.resources({
        type: "upload",
        prefix: folder + "/",  // harus diakhiri '/'
        max_results: 100, // batas maksimal hasil (bisa di-set lebih)
        resource_type: "image",
      });
  
      // Map data supaya yang dikirim hanya url dan public_id
      const images = result.resources.map((img) => ({
        url: img.secure_url,
        public_id: img.public_id,
      }));
  
      res.json({ images });
    } catch (error) {
      next(error);
    }
  };

module.exports = {listGalleryImages};
  