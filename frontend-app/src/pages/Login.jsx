import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debug, setDebug] = useState(""); 
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setDebug("Logging in...");

      const res = await fetch("https://unit3-project.onrender.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        setDebug(`Login failed: ${errData.message}`);
        return;
      }

      const data = await res.json();
      setDebug(`Login success! Token: ${data.token}`);

      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/rides");
      }
    } catch (err) {
      console.error(err);
      setDebug("Network error or server is down");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>

        {/* Debug output */}
        <pre style={{ marginTop: "15px", color: "red" }}>{debug}</pre>
      </div>
    </div>
  );
}
