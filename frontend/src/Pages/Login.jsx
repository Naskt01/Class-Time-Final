
import React, { useState } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import "../styles/Login.css";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const role = new URLSearchParams(location.search).get("role");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username,
          password: password,
          expectedRole: role.toLowerCase()
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store user in context
        login(data.user); // <-- this updates AuthContext
        localStorage.setItem("user", JSON.stringify(data.user)); // optional, still keeps session

        // Navigate based on role
        if (data.user.role === "student") {
          navigate("/student-dashboard");
        } else if (data.user.role === "teacher") {
          navigate("/teacher-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1 className="login-title">ClassTime</h1>
      <p style={{ textAlign: "center" }}>Logging in as <b>{role}</b></p>
      <hr />
      {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}

      <form className="login-form" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button" disabled={loading}>
          <FaSignInAlt className="login_icon" /> {loading ? "Signing In..." : "SignIn"}
        </button>
      </form>
    </div>
  );
}

export default Login;
