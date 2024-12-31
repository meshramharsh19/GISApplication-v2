const mongoose = require('mongoose');

// Define KML Schema
const KMLSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true }, // Name of the uploaded file
    kmlData: { type: Buffer, required: true },  // Storing KML file as binary data
    contentType: { type: String, required: true }, // MIME type of the file
    uploadDate: { type: Date, default: Date.now },  // Automatically set the upload date
  },
  { timestamps: true }
);

// Create and export KML model
const KML = mongoose.model('KML', KMLSchema);
module.exports = KML;
