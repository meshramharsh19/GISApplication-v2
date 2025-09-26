// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
require('dotenv').config();
const path = require('path');

const app = express();

// Load Mongo URIs from .env
const mongoSessionURI = process.env.MONGODB_USER || 'mongodb://127.0.0.1:27017/react-auth';
const mongoPrimaryURI = process.env.MONGODB_USER || 'mongodb://127.0.0.1:27017/react-auth';
const mongoKmlURI = process.env.MONGODB_KML || 'mongodb://127.0.0.1:27017/kmlFiles';

// Middleware
// For development, configure CORS to allow credentials from your React dev server
app.use(cors({
  origin: 'http://localhost:3000', // URL of your React app
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: "fhlfkajfhsuigfhwughfjsehiuwh",
  resave: false,
  saveUninitialized: false, // Changed to false for better practice
  store: MongoStore.create({
    mongoUrl: mongoSessionURI,
    collectionName: 'sessions',
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================================================
//  API Routes (SHOULD BE BEFORE SERVING REACT APP)
// =======================================================
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

// =======================================================
//  SERVE REACT APP (FOR PRODUCTION)
// =======================================================
// This code will only run in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../build')));

  // Catch-all route to serve index.html for any request that doesn't match an API route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
  });
}

// MongoDB Connections (No change here)
mongoose.connect(mongoPrimaryURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Primary MongoDB Connected'))
  .catch((err) => {
    console.error('❌ Failed to connect to Primary MongoDB:', err.message);
    process.exit(1);
  });

const kmlDbConnection = mongoose.createConnection(mongoKmlURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
kmlDbConnection
  .once('open', () => console.log('✅ New MongoDB Connected (KML Files Database)'))
  .on('error', (err) => console.error('❌ Failed to connect to New MongoDB:', err.message));

module.exports = { kmlDbConnection };

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});