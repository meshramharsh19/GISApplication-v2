const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const FileModel = require('../models/KML'); // Import the File model

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('kml'), async (req, res) => {
    try {
        const { file } = req;
        if (!file) return res.status(400).send('No file uploaded');

        // Check if the file is a valid KML file
        if (!file.originalname.endsWith('.kml')) {
            return res.status(400).send('Only KML files are allowed');
        }

        const fileContent = fs.readFileSync(file.path, 'utf8');

        // Save the file content in the database
        const newFile = new FileModel({
            fileName: file.originalname,
            fileData: fileContent,
        });

        await newFile.save();
        fs.unlinkSync(file.path); // Remove the uploaded file from local storage

        res.status(201).json({ message: 'File uploaded and saved to MongoDB', id: newFile._id });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Server error');
    }
});

module.exports = router;
