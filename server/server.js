// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const groupRoutes = require('./routes/groupRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }
));
app.use(express.json());

app.use('/api/groups', groupRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection failed:', err));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
