import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        return alert(errData.message || "Registration failed");
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
        <h2>Create Account</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(