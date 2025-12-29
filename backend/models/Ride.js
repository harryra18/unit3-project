const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  miles: Number,
  totalElevation: String,
  zone: Number,
  averageBPM: Number,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Ride", rideSchema);
