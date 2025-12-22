import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Rides() {
  const [rides, setRides] = useState([])
  const [miles, setMiles] = useState('')
  const [zone, setZone] = useState(1)
  const [avgBpm, setAvgBpm] = useState('')

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  // PROTECT ROUTE
  useEffect(() => {
    if (!token) {
      navigate('/')
    } else {
      fetchRides()
    }
  }, [])

  // GET rides for logged-in user only
  const fetchRides = async () => {
    const res = await fetch('http://localhost:4000/rides', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    const data = await res.json()
    setRides(data)
  }

  // CREATE new ride
  const addRide = async () => {
    await fetch('http://localhost:4000/rides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        date: new Date(),
        miles,
        totalElevation: '2000 ft',
        zone,
        averageBPM: avgBpm
      })
    })

    setMiles('')
    setAvgBpm('')
    fetchRides()
  }

  // LOGOUT
  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div>
      <h2>My Road Cycling Logs</h2>

      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Add Ride</h3>

      <input
        placeholder="Miles"
        value={miles}
        onChange={e => setMiles(e.target.value)}
      />

      <input
        placeholder="Average BPM"
        value={avgBpm}
        onChange={e => setAvgBpm(e.target.value)}
      />

      <select value={zone} onChange={e => setZone(Number(e.target.value))}>
        <option value={1}>Zone 1</option>
        <option value={2}>Zone 2</option>
        <option value={3}>Zone 3</option>
        <option value={4}>Zone 4</option>
        <option value={5}>Zone 5</option>
      </select>

      <button onClick={addRide}>Save Ride</button>

      <hr />

      <h3>Your Rides</h3>

      {rides.length === 0 && <p>No rides logged yet.</p>}

      {rides.map(ride => (
        <div key={ride._id}>
          <p>
            {new Date(ride.date).toLocaleDateString()} — {ride.miles} miles —
            Zone {ride.zone} — Avg BPM {ride.averageBPM}
          </p>
        </div>
      ))}
    </div>
  )
}
