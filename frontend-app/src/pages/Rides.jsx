import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [date, setDate] = useState("");
  const [miles, setMiles] = useState("");
  const [totalElevation, setTotalElevation] = useState("");
  const [zone, setZone] = useState(1);
  const [avgBpm, setAvgBpm] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Protect route
  useEffect(() => {
    if (!token) navigate("/");
    else fetchRides();
  }, []);

  const fetchRides = async () => {
    const res = await fetch("http://localhost:4000/rides", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRides(data);
  };

  const addRide = async () => {
    if (!miles || !avgBpm || !totalElevation) {
      alert("Please fill in all required fields.");
      return;
    }

    await fetch("http://localhost:4000/rides", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        date: date || new Date(),
        miles,
        totalElevation,
        zone,
        averageBPM: avgBpm
      })
    });

    setDate("");
    setMiles("");
    setTotalElevation("");
    setAvgBpm("");
    fetchRides();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <h2>My Road Cycling Logs</h2>
      <button className="logout-btn" onClick={logout}>Logout</button>

      <h3>Add Ride</h3>
      <div className="form">
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <input
          placeholder="Miles"
          value={miles}
          onChange={e => setMiles(e.target.value)}
        />
        <input
          placeholder="Total Elevation (e.g., 2000 ft)"
          value={totalElevation}
          onChange={e => setTotalElevation(e.target.value)}
        />
        <input
          placeholder="Average BPM"
          value={avgBpm}
          onChange={e => setAvgBpm(e.target.value)}
        />
        <select value={zone} onChange={e => setZone(Number(e.target.value))}>
          <option value={1}>Zone 1</option>
          <option value={2}>Zone 2</option>
          