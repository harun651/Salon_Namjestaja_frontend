import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

const Prijava = forwardRef(({ onLogin }, ref) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useImperativeHandle(ref, () => ({
    async loginUser(user, pass) {
      setError('');
      try {
        const response = await api.post('api-token-auth/', { username: user, password: pass });
        const token = response.data.token;
        localStorage.setItem('token', token);

        const userResponse = await api.get('current-user/');
        const userData = userResponse.data;
        localStorage.setItem('user', JSON.stringify(userData));

        if (onLogin) onLogin(token, userData);

        if (userData.is_staff) {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
        setError('Neispravno korisničko ime ili šifra.');
      }
    }
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('api-token-auth/', { username, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const userResponse = await api.get('current-user/');
      const userData = userResponse.data;
      localStorage.setItem('user', JSON.stringify(userData));

      if (onLogin) onLogin(token, userData);

      if (userData.is_staff) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError('Neispravno korisničko ime ili šifra.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.heading}>Prijava</h2>
        {error && <p style={styles.error}>{error}</p>}

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
            type="password"
            placeholder="šifra"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Prijavi se
          </button>
        </form>
      </div>
    </div>
  );
});

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
  form: {
    display: "flex",
    flexDirection: "column",
  },
};

export default Prijava;
