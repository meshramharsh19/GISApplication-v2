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

// Debugging logs
console.log("Primary DB URI:", mongoPrimaryURI);
console.log("KML DB URI:", mongoKmlURI);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: "fhlfkajfhsuigfhwughfjsehiuwh", // keep secret safe in .env
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoSessionURI,
    collectionName: 'sessions',
  }),
}));

// Static file serving for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);




// MongoDB Connection 1 (Primary Database)
mongoose.connect(mongoPrimaryURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Primary MongoDB Connected'))
  .catch((err) => {
    console.error('❌ Failed to connect to Primary MongoDB:', err.message);
    process.exit(1);
  });

// MongoDB Connection 2 (KML Files Database)
const kmlDbConnection = mongoose.createConnection(mongoKmlURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

kmlDbConnection
  .once('open', () => console.log('✅ New MongoDB Connected (KML Files Database)'))
  .on('error', (err) => console.error('❌ Failed to connect to New MongoDB:', err.message));

// Export new connection for KML-related models
module.exports = { kmlDbConnection };





// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
