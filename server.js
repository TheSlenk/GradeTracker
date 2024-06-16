// server/App.js
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const mongo = require('mongodb');
require('dotenv').config();

const mongoClient = mongo.MongoClient;
const app = express();
const PORT = process.env.PORT || 3000;

const mock_course = {
  "courseId": null,
  "courseName": "Untitled",
  "categories": [
    {"name": "Exam", "grade": 80, "weight": 50}
  ],
  "owner": null,
  "readonly": [],
  "term": null
};

let db;

// Middleware
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use(session({
  secret: "audbaiupwdbauidbawiudbddsjmbdnfyfeshbjshfbla",
  saveUninitialized: true,
  cookie: {
    username: undefined,
    email: undefined,
    loggedin: false,
    lastTermVisited: null
  },
  resave: false
}));

// Static files (not needed for React)
app.use(express.static('style'));
app.use(express.static('scripts'));

// View engine (not needed for React)
app.set('views', 'view');
app.set('view engine', 'pug');

// Import routes
const testRoutes = require('./routes/test');

// Use routes
app.use('/api/test', testRoutes);

// Database connection
console.log('Connecting to database...');
mongoClient.connect('mongodb://127.0.0.1:27017', { useNewUrlParser: true }, (err, client) => {
  if (err) throw err;

  db = client.db('GradeTracker');
  accounts = db.collection('accounts');
  console.log('Connected to Database!');

  console.log("Starting Server...");
  app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}/`));
});
