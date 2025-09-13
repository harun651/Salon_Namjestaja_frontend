import React, { useEffect, useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import './NaslovnaStranica.css';

function NaslovnaStranica() {
  const [najnovijiNamjestaj, setNajnovijiNamjestaj] = useState([]);

  useEffect(() => {
    api.get("najnoviji/")
      .then((res) => {
        console.log("Pozvan najnoviji namještaj:", res.data);
        setNajnovijiNamjestaj(res.data);
      })
      .catch((err) => console.error("Greška pri dohvaćanju najnovijih:", err));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return '';
    return path.startsWith('http') ? path : `http://localhost:8000${path}`;
  };

  return (
    <div className="okvir">
      <section>
        <h1>Najnoviji namještaj</h1>
        <div className="uniform-grid">
          {najnovijiNamjestaj.length === 0 && <p>Učitavanje...</p>}
          {najnovijiNamjestaj.map((item) => (
            <div className="namjestaj-karta" key={item.id}>
              <Link to={`/namjestaj/${item.id}`} className="namjestaj-link" style={{display: 'flex', width: '100%', height: '100%'}}>
                <img 
                  src={getImageUrl(item.slika)} 
                  alt={`Namještaj: ${item.naziv}`} 
                  loading="lazy" 
                />
                <h2>{item.naziv}</h2>
              </Link>
            </div>
          ))}
        </div>

      </section>
    </div>
  );
}

export default NaslovnaStranica;
