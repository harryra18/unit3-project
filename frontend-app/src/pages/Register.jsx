import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debug, setDebug] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setDebug("Registering...");

      const res = await fetch("https://unit3-project.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const err = await res.json();
        setDebug(`Registration failed: ${err.message}`);
        return;
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setDebug("Registration success!");
      navigate("/rides");
    } catch (err) {
      console.error(err);
      setDebug("Network error or server is down");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button onClick={handleRegister}>Create Account</button>
        <p>Already have an account? <Link to="/">Login</Link></p>
        <pre style={{ color: "red" }}>{debug}</pre>
      </div>
    </div>
  );
}
