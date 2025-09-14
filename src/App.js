import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigacijskaTraka from './NavigacijskaTraka';
import NaslovnaStranica from './NaslovnaStranica';
import NamjestajStranica from './NamjestajStranica';
import NamjestajDetalji from './NamjestajDetalji';
import ONama from './ONama';
import Registracija from './Registracija';
import Prijava from './Prijava';
import ChatWidget from './ChatWidget';
import api from './api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  const PrijaviSe = async (username, password) => {
    try {
      const response = await api.post('api-token-auth/', { username, password });
      const newToken = response.data.token;
      localStorage.setItem('token', newToken);
      const userResponse = await api.get('current-user/');
      const userData = userResponse.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const OdjaviSe = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <NavigacijskaTraka user={user} onLogout={OdjaviSe} />
      <Routes>
        <Route path="/" element={<NaslovnaStranica />} />
        <Route path="/namjestaj" element={<NamjestajStranica user={user} token={token} />} />
        <Route path="/namjestaj/:id" element={<NamjestajDetalji user={user} token={token} />} />
        <Route path="/ONama" element={<ONama />} />
        <Route
          path="/login"
          element={token ? <Navigate to="/" replace /> : <Prijava onLogin={PrijaviSe} />}
        />
        <Route
          path="/registracija"
          element={token ? <Navigate to="/" replace /> : <Registracija onRegister={PrijaviSe} />}
        />
        <Route path="*" element={<p style={{ padding: 20 }}>Stranica nije pronađena</p>} />
      </Routes>
      <ChatWidget user={user} token={token} />
    </Router>
  );
}

export default App;
