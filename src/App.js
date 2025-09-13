import React, { useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import NavigacijskaTraka from './NavigacijskaTraka';
import NaslovnaStranica from './NaslovnaStranica';
import NamjestajStranica from './NamjestajStranica';
import NamjestajDetalji from './NamjestajDetalji';
import ONama from './ONama';
import Prijava from './Prijava';
import Registracija from './Registracija';
import ChatWidget from './ChatWidget';



function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });
  const loginRef = useRef();

  const PrijaviSe = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const RegistrujSe = (username, password) => {
    loginRef.current?.loginUser(username, password);
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
        <Route path="/namjestaj" element={<NamjestajStranica user={user} />} />
        <Route path="/namjestaj/:id" element={<NamjestajDetalji user={user} />} />
        <Route path="/ONama" element={<ONama />} />

        <Route path="/login" element={
          token ? <Navigate to="/" replace /> : <Prijava ref={loginRef} onLogin={PrijaviSe} />
        } />

        <Route path="/registracija" element={
          token ? <Navigate to="/" replace /> : <Registracija onRegister={RegistrujSe} />
        } />

        <Route path="*" element={<p style={{ padding: 20 }}>Stranica nije pronađena</p>} />

        
      </Routes>
      
      
      <ChatWidget user={user} token={token} />
    
    </Router>
  );
}

export default App;
