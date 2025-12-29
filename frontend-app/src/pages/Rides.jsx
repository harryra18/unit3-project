import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [date, setDate] = useState("");
  const [miles, setMiles] = useState("");
  const [totalElevation, setTotalElevation] = useState("");
  const [zone, setZone] = useState(1);
  const [avgBpm, setAvgBpm] = useState("");
  const [debug, setDebug] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Protect route
  useEffect(() => {
    if (!token) navigate("/");
    else fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await fetch("https://unit3-project.onrender.com/rides", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        setDebug("Failed to fetch rides");
        return;
      }
      const data = await res.json();
      setRides(data);
    } catch (err) {
      console.error(err);
      setDebug("Network error fetching rides");
    }
  };

  const addRide = async () => {
    if (!miles || !avgBpm || !totalElevation) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const res = await fetch("https://unit3-project.onrender.com/rides", {
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
      if (!res.ok) {
        setDebug("Failed to add ride");
        return;
      }
      setDate(""); setMiles(""); setTotalElevation(""); setAvgBpm("");
      fetchRides();
    } catch (err) {
      console.error(err);
      setDebug("Network error adding ride");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container">
      <div className="card">
        <h2>My Rides</h2>
        <button onClick={logout}>Logout</button>

        <h3>Add Ride</h3>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Miles" value={miles} onChange={e => setMiles(e.target.value)} />
        <input placeholder="Total Elevation" value={totalElevation} onChange={e => setTotalElevation(e.target.value)} />
        <input placeholder="Average BPM" value={avgBpm} onChange={e => setAvgBpm(e.target.value)} />
        <select value={zone} onChange={e => setZone(Number(e.target.value))}>
          {[1,2,3,4,5].map(z => <option key={z} value={z}>Zone {z}</option>)}
        </select>
        <button onClick={addRide}>Save Ride</button>

        <h3>Your Rides</h3>
        {rides.length === 0 && <p>No rides logged yet.</p>}
        {rides.map(ride => (
          <div key={ride._id} className="ride-card">
            <p>
              {new Date(ride.date).toLocaleDateString()} — {ride.miles} miles — Zone {ride.zone} — Avg BPM {ride.averageBPM} — Elevation {ride.totalElevation}
            </p>
          </div>
        ))}

        <pre style={{ color: "red" }}>{debug}</pre>
      </div>
    </div>
  );
}
