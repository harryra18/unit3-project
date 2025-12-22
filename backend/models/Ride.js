const mongoose = require('mongoose')

const rideSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true
    },
    miles: {
      type: String,
      required: true
    },
    totalElevation: {
      type: String,
      required: true
    },
    zone: {
      type: Number,
      required: true
    },
    averageBPM: {
      type: Number,
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Ride', rideSchema)
