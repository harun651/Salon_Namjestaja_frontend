import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from './api';

function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div style={{
        background: 'white', padding: 30, borderRadius: 18,
        maxWidth: '90%', width: 450,
        boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.15) inset',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}>
        {children}
        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            backgroundColor: '#e00202',
            border: 'none',
            color: 'white',
            fontWeight: '700',
            padding: '10px 20px',
            borderRadius: 12,
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#b00000'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = '#e00202'}
        >
          Zatvori
        </button>
      </div>
    </div>
  );
}

function NamjestajDetalji({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [namjestaj, setNamjestaj] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    naziv: '', opis: '', kategorija: '', slika: null, materijali: '', količina_u_skladistu: 0
  });

  const categories = {
    DB: 'Dnevni boravak', SS: 'Spavaća soba', KU: 'Kuhinja',
    TR: 'Trpezarija', HO: 'Hodnik'
  };

  useEffect(() => {
    fetchItem();
  }, [id]);

  async function fetchItem() {
    try {
      const res = await api.get(`namjestaj/${id}/`);
      setNamjestaj(res.data);
      setEditData({
        naziv: res.data.naziv || '',
        opis: res.data.opis || '',
        kategorija: res.data.kategorija || '',
        slika: null,
        materijali: res.data.materijali || '',
        količina_u_skladistu: res.data.količina_u_skladistu || 0
      });
    } catch (err) {
      alert('Greška pri dohvaćanju podataka: ' + err.message);
      navigate('/namjestaj');
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('naziv', editData.naziv);
      formData.append('opis', editData.opis);
      formData.append('kategorija', editData.kategorija);
      formData.append('materijali', editData.materijali);
      formData.append('količina_u_skladistu', editData.količina_u_skladistu);
      if (editData.slika) formData.append('slika', editData.slika);

      const res = await api.put(`namjestaj/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setNamjestaj(res.data);
      setEditModalOpen(false);
      alert('Uspješno ažurirano.');
    } catch (err) {
      alert('Greška pri ažuriranju: ' + err.message);
    }
  }

  if (!namjestaj) return <p style={{ textAlign: 'center', marginTop: 40 }}>Učitavanje...</p>;

  const getImageUrl = (path) =>
    path?.startsWith('http') ? path : `http://localhost:8000${path}`;

  return (
    <div style={{
      maxWidth: 900,
      margin: '40px auto',
      padding: '30px 20px',
      background: 'linear-gradient(145deg, #ffffff, #eaeaea)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2), 0 2px 6px rgba(0,0,0,0.1) inset',
      borderRadius: 18,
      border: '1px solid rgba(0,0,0,0.15)',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: '#222',
      position: 'relative',
    }}>
      <h1 style={{ marginBottom: 20, fontSize: '2.5rem', fontWeight: 700 }}>{namjestaj.naziv}</h1>
      <img
        src={getImageUrl(namjestaj.slika)}
        alt={namjestaj.naziv}
        style={{
          maxWidth: '100%',
          width: '100%',
          borderRadius: 14,
          marginBottom: 30,
          objectFit: 'contain',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
        loading="lazy"
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}><b>Opis:</b> {namjestaj.opis}</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}><b>Kategorija:</b> {categories[namjestaj.kategorija] || namjestaj.kategorija}</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}><b>Materijali:</b> {namjestaj.materijali}</p>
        <p style={{ fontSize: '1.1rem', fontWeight: 600 }}><b>Količina u skladištu:</b> {namjestaj.količina_u_skladistu}</p>

        {user?.is_staff && (
          <button
            onClick={() => setEditModalOpen(true)}
            style={{
              marginTop: 12,
              backgroundColor: '#e00202',
              border: 'none',
              color: 'white',
              fontWeight: '700',
              padding: '10px 20px',
              borderRadius: 18,
              cursor: 'pointer',
              transition: 'background-color 0.3s ease',
              maxWidth: 150,
              fontSize: '1.1rem',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#b00000'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#e00202'}
          >
            Uredi
          </button>
        )}

        <p style={{ marginTop: 30 }}>
          <Link to="/namjestaj" style={{ color: '#e00202', textDecoration: 'none', fontWeight: '600' }}>
            ← Nazad na pregled namještaja
          </Link>
        </p>
      </div>

      <Modal isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
        <h2 style={{ marginBottom: 20, fontSize: '1.8rem', fontWeight: 700 }}>Uredi namještaj</h2>
        <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label style={{ fontWeight: 600, fontSize: '1rem' }}>Naziv:</label>
          <input
            type="text"
            required
            value={editData.naziv}
            onChange={e => setEditData({ ...editData, naziv: e.target.value })}
            style={{
              padding: 10,
              borderRadius: 10,
              border: '1.8px solid #ccc',
              fontSize: 16,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              marginBottom: 12,
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#e00202'}
            onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
          />

          <label style={{ fontWeight: 600, fontSize: '1rem' }}>Opis:</label>
          <textarea
            required
            value={editData.opis}
            onChange={e => setEditData({ ...editData, opis: e.target.value })}
            style={{
              padding: 10,
              borderRadius: 10,
              border: '1.8px solid #ccc',
              fontSize: 16,
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical',
              minHeight: 100,
              transition: 'border-color 0.2s ease',
              marginBottom: 12,
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#e00202'}
            onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
          />

          <label style={{ fontWeight: 600, fontSize: '1rem' }}>Kategorija:</label>
          <select
            value={editData.kategorija}
            onChange={e => setEditData({ ...editData, kategorija: e.target.value })}
            style={{
              padding: 10,
              borderRadius: 12,
              border: '1.8px solid #bbb',
              fontSize: 16,
              fontFamily: 'inherit',
              outline: 'none',
              marginBottom: 12,
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#e00202'}
            onBlur={e => e.currentTarget.style.borderColor = '#bbb'}
          >
            {Object.entries(categories).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>

          <label style={{ fontWeight: 600, fontSize: '1rem' }}>Slika (promijeni):</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setEditData({ ...editData, slika: e.target.files[0] })}
            style={{ marginBottom: 12 }}
          />

          <label style={{ fontWeight: 600, fontSize: '1rem' }}>Materijali:</label>
          <input
            type="text"
            value={editData.materijali}
            onChange={e => setEditData({ ...editData, materijali: e.target.value })}
            style={{
              padding: 10,
              borderRadius: 10,
              border: '1.8px solid #ccc',
              fontSize: 16,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              marginBottom: 12,
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#e00202'}
            onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
          />

          <label style={{ fontWeight: 600, fontSize: '1rem' }}>Količina u skladištu:</label>
          <input
            type="number"
            min="0"
            value={editData.količina_u_skladistu}
            onChange={e => setEditData({ ...editData, količina_u_skladistu: e.target.value })}
            style={{
              padding: 10,
              borderRadius: 10,
              border: '1.8px solid #ccc',
              fontSize: 16,
              fontFamily: 'inherit',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              marginBottom: 12,
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#e00202'}
            onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
          />

          <button
            type="submit"
            style={{
              marginTop: 12,
              backgroundColor: '#e00202',
              border: 'none',
              color: 'white',
              fontWeight: '700',
              padding: '12px 0',
              borderRadius: 14,
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#b00000'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#e00202'}
          >
            Spremi
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default NamjestajDetalji;
