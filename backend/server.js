const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRoutes = require('./routes/userRoutes');
const fileRoutes = require('./routes/fileRoutes');
require('dotenv').config();
console.log("MongoDB URI:",   "mongodb://localhost:27017/react-auth" ); // Debugging line
const path = require('path');

const app = express();
const mongoSessionURI = "mongodb://localhost:27017/react-auth";
if (!mongoSessionURI) {
  console.error("MongoDB URI for session store is missing.");
  process.exit(1);
}
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: "fhlfkajfhsuigfhwughfjsehiuwh",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: mongoSessionURI,
    collectionName: 'sessions',
  }),
}));

// Static file serving for uploaded files (if needed)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);




// MongoDB Connection 1 (Primary Database)
const mongoURI = process.env.MONGODB_USER || 'mongodb://127.0.0.1:27017/react-auth';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Primary MongoDB Connected'))
  .catch((err) => {
    console.error('Failed to connect to Primary MongoDB:', err.message);
    process.exit(1);
  });

// MongoDB Connection 2 (KML Files Database)
const newMongoURI = process.env.MONGODB_KML || 'mongodb://localhost:27017/kmlFiles';
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
