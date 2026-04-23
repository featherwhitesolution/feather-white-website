const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

const router = express.Router();

const upload = multer({ storage });

router.post('/', (req, res) => {
    console.log('--- Upload request received ---');
    upload.single('image')(req, res, function (err) {
        if (err) {
            console.error('Multer/Cloudinary Upload Error:', err);
            return res.status(500).json({ message: err.message || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }
        // Return the Cloudinary URL in a json object
        res.json({ url: req.file.path });
    });
});

module.exports = router;

