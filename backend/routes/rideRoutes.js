const express = require("express");
const Ride = require("../models/Ride");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();

// GET all rides for logged-in user with user email
router.get("/", verifyToken, async (req, res) => {
  try {
    const rides = await Ride.find({ user: req.userId })
      .sort({ date: -1 })
      .populate("user", "email"); // include email
    res.json(rides);
  } catch (err) {
    console.error("GET RIDES ERROR:", err);
    res.status(500).json({ message: "Error fetching rides" });
  }
});

// CREATE new ride
router.post("/", verifyToken, async (req, res) => {
  const { date, miles, totalElevation, zone, averageBPM } = req.body;
  if (!miles || !averageBPM)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    const ride = await Ride.create({
      date,
      miles,
      totalElevation,
      zone,
      averageBPM,
      user: req.userId
    });
    res.json(ride);
  } catch (err) {
    console.error("CREATE RIDE ERROR:", err);
    res.status(500).json({ message: "Error creating ride" });
  }
});

// UPDATE ride
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    res.json(ride);
  } catch (err) {
    console.error("UPDATE RIDE ERROR:", err);
    res.status(500).json({ message: "Error updating ride" });
  }
});

// DELETE ride
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const ride = await Ride.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });

    if (!ride) return res.status(404).json({ message: "Ride not found" });

    res.json({ message: "Ride deleted" });
  } catch (err) {
    console.error("DELETE RIDE ERROR:", err);
    res.status(500).json({ message: "Error deleting ride" });
  }
});

module.exports = router;
