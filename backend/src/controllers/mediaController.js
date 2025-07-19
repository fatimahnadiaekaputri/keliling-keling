const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const uploadImage = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({message: 'File tidak ditemukan'});
        }

        const streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'artikel_keliling_keling',
                    },
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const result = await streamUpload(req);

        res.status(200).json({
            message: 'Upload berhasil',
            url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        next(error);
    }
}

const deleteImage = async (req, res, next) => {
    try {
        const {public_id} = req.body;
        if(!public_id) {
            return res.status(400).json({message: 'public_id is required'})
        }

        const result = await cloudinary.uploader.destroy(public_id, {
            invalidate: true,
            resource_type: 'image',
        });

        if (result.result === 'ok') {
            res.json({messgae: 'Image is successfully removed'});
        } else {
            res.status(400).json({message: 'Failed to remove image', result})
        }
    } catch (error) {
        next(error);
    }
};

module.exports = {uploadImage, deleteImage};