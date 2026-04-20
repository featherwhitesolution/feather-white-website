const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinaryConfig');

const router = express.Router();

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ message: 'No file uploaded' });
    }
    // Return the Cloudinary URL in a json object
    res.json({ url: req.file.path });
});

module.exports = router;

