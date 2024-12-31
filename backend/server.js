const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes'); // Import File routes
require('dotenv').config();
const path = require('path');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json()); // Parse incoming requests with JSON payloads
app.use(bodyParser.urlencoded({ extended: true })); // Handle URL-encoded payloads

// Static file serving for uploaded files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes); // User-related routes
app.use('/api/files', fileRoutes); // File-related routes

// MongoDB Connection 1 (Primary Database)
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/react-auth';
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Primary MongoDB Connected'))
  .catch((err) => {
    console.error('Failed to connect to Primary MongoDB:', err.message);
    process.exit(1); // Exit the process if the connection fails
  });

// MongoDB Connection 2 (KML Files Database)
const newMongoURI = process.env.NEW_MONGODB_URI || 'mongodb://localhost:27017/kmlFiles';
const kmlDbConnection = mongoose.createConnection(newMongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

kmlDbConnection
  .once('open', () => console.log('New MongoDB Connected (KML Files Database)'))
  .on('error', (err) => console.error('Failed to connect to New MongoDB:', err.message));

// Export new connection for KML-related models
module.exports = { kmlDbConnection };

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
