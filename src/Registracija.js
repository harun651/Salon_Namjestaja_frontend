import React, { useState } from "react";
import axios from "axios";

function Registracija({ onRegister }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== password2) {
      setError("Šifre se ne podudaraju.");
      return;
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/registracija/", {
        username,
        email,
        password,
        password2,
      });

      setSuccess("Registracija uspješna! Automatski se prijavljujete...");

      setUsername("");
      setEmail("");
      setPassword("");
      setPassword2("");

      if (onRegister) onRegister(username, password);

    } catch (err) {
      if (err.response && err.response.data.detail) {
        setError(Array.isArray(err.response.data.detail) ? err.response.data.detail.join(", ") : err.response.data.detail);
      } else {
        setError("Došlo je do greške kod registracije.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Registracija</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Korisničko ime"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="šifra"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Ponovi šifru"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Registruj se
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "40px 30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    maxWidth: "400px",
    width: "100%",
  },
  heading: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#c40000",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    marginBottom: "15px",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#c40000",
    color: "#000",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background 0.3s",
  },
  error: {
    color: "#c40000",
    marginBottom: "10px",
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: "10px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
};

export default Registracija;
