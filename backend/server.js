const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const rideRoutes = require('./routes/rideRoutes')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/rides', rideRoutes)

// Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err))

// Server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
