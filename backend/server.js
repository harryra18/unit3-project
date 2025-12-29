const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const rideRoutes = require('./routes/rideRoutes');

const app = express();

app.use(cors({
  origin: '*' 
}));

app.use(express.json());

// log all requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} BODY:`, req.body);
  next();
});

// Health check route
app.get('/', (req, res) => {
  res.send('Server is running 🚴‍♂️');
});

// Routes
app.use('/auth', authRoutes);
app.use('/rides', rideRoutes);

mongoose
