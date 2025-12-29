import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Rides() {
  const [rides, setRides] = useState([]);
  const [date, setDate] = useState("");
  const [miles, setMiles] = useState("");
  const [totalElevation, setTotalElevation] = useState("");
  const [zone, setZone] = useState(1);
  const [avgBpm, setAvgBpm] = useState("");
  const [editingRideId, setEditingRideId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) navigate("/");
    else fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await fetch("https://unit3-project.onrender.com/rides", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRides(data);
    } catch (err) {
      console.error("Network error fetching rides", err);
    }
  };

  const saveRide = async () => {
    if (!miles || !avgBpm || !totalElevation) {
      alert("Please fill all required fields");
      return;
    }

    const rideData = {
      date: date || new Date(),
      miles,
      totalElevation,
      zone,
      averageBPM: avgBpm
    };

    try {
      if (editingRideId) {
        // UPDATE existing ride
        await fetch(`https://unit3-project.onrender.com/rides/${editingRideId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(rideData)
        });
        setEditingRideId(null); // exit editing mode
      } else {
        // CREATE new ride
        await fetch("https://unit3-project.onrender.com/rides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(rideData)
        });
      }

      // Clear form
      setDate(""); setMiles(""); setTotalElevation(""); setAvgBpm("");
      fetchRides();
    } catch (err) {
      console.error("Network error saving ride", err);
    }
  };

  const editRide = (ride) => {
    setEditingRideId(ride._id);
    setDate(new Date(ride.date).toISOString().slice(0, 10));
    setMiles(ride.miles);
    setTotalElevation(ride.totalElevation);
    setZone(ride.zone);
    setAvgBpm(ride.averageBPM);
  };

  const cancelEdit = () => {
    setEditingRideId(null);
    setDate(""); setMiles(""); setTotalElevation(""); setAvgBpm("");
  };

  const deleteRide = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;

    try {
      await fetch(`https://unit3-project.onrender.com/rides/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchRides();
    } catch (err) {
      console.error("Network error deleting ride", err);
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

        <h3>{editingRideId ? "Edit Ride" : "Add Ride"}</h3>

        <input type="date" value={date} onChange={e => setDate(e.target.value)} />
        <input placeholder="Miles" value={miles} onChange={e => setMiles(e.target.value)} />
        <input placeholder="Total Elevation" value={totalElevation} onChange={e => setTotalElevation(e.target.value)} />
        <input placeholder="Average BPM" value={avgBpm} onChange={e => setAvgBpm(e.target.value)} />
        <select value={zone} onChange={e => setZone(Number(e.target.value))}>
          {[1,2,3,4,5].map(z => <option key={z} value={z}>Zone {z}</option>)}
        </select>

        <button onClick={saveRide}>{editingRideId ? "Update Ride" : "Save Ride"}</button>
        {editingRideId && <button onClick={cancelEdit}>Cancel</button>}

        <h3>Your Rides</h3>
        {rides.length === 0 && <p>No rides logged yet.</p>}

        {rides.map(ride => (
          <div key={ride._id} className="ride-card">
            <p>
              {new Date(ride.date).toLocaleDateString()} — {ride.miles} miles — Zone {ride.zone} — Avg BPM {ride.averageBPM} — Elevation {ride.totalElevation}
            </p>
            <button onClick={() => editRide(ride)}>Edit</button>
            <button onClick={() => deleteRide(ride._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
