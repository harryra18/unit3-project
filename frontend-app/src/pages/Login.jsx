import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        return alert(errData.message || "Login failed");
      }

      const data = await res.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        navigate("/rides");
      }
    } catch (err) {
      console.error(err);
      alert("Network error or server is down");
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
          placeholder="Passwor