import React, { useEffect, useState } from 'react';
import api from './api';
import { Link } from 'react-router-dom';
import './NamjestajStranica.css';

function Modal({ children, isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button onClick={onClose} className="modal-close-button">Zatvori</button>
      </div>
    </div>
  );
}

function NamjestajStranica({ user }) {
  const [namjestaj, setNamjestaj] = useState([]);
  const [izabranaKategorija, setizabranaKategorija] = useState('ALL');
  const [sortiranjeOpcija, setsortiranjeOpcija] = useState('A-Ž');
  const [searchbar, setsearchbar] = useState('');
  const [trenutnaStranica, settrenutnaStranica] = useState(1);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    naziv: '', opis: '', kategorija: 'DB', slika: null, materijali: '', kolicina_u_skladistu: 0
  });

  const itemsPerPage = 15;
  const categories = [
    { label: 'Sav namještaj', value: 'ALL' },
    { label: 'Dnevni boravak', value: 'DB' },
    { label: 'Spavaća soba', value: 'SS' },
    { label: 'Kuhinja', value: 'KU' },
    { label: 'Trpezarija', value: 'TR' },
    { label: 'Hodnik', value: 'HO' },
  ];

  useEffect(() => {
    fetchNamjestaj();
  }, []);

  async function fetchNamjestaj() {
    try {
      const res = await api.get('namjestaj/');
      setNamjestaj(res.data);
    } catch (err) {
      console.error('Greška pri dohvaćanju namještaja:', err);
    }
  }

  const getImageUrl = (path) =>
    path?.startsWith('http') ? path : `http://localhost:8000${path}`;

  const filtered = namjestaj
    .filter(n => izabranaKategorija === 'ALL' || n.kategorija === izabranaKategorija)
    .filter(n => n.naziv.toLowerCase().includes(searchbar.toLowerCase()))
    .sort((a, b) => sortiranjeOpcija === 'A-Ž' ? a.naziv.localeCompare(b.naziv) : b.naziv.localeCompare(a.naziv));

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((trenutnaStranica - 1) * itemsPerPage, (trenutnaStranica - 1) * itemsPerPage + itemsPerPage);

  useEffect(() => settrenutnaStranica(1), [izabranaKategorija, sortiranjeOpcija, searchbar]);

  const goToPage = page => {
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    settrenutnaStranica(page);
  };

  async function handleAddSubmit(e) {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('naziv', newItem.naziv);
      formData.append('opis', newItem.opis);
      formData.append('kategorija', newItem.kategorija);
      formData.append('materijali', newItem.materijali);
      formData.append('količina_u_skladistu', newItem.kolicina_u_skladistu);
      if (newItem.slika) formData.append('slika', newItem.slika);

      const res = await api.post('namjestaj/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setNamjestaj(prev => [...prev, res.data]);
      setAddModalOpen(false);
      setNewItem({ naziv: '', opis: '', kategorija: 'DB', slika: null, materijali: '', kolicina_u_skladistu: 0 });
    } catch (err) {
      alert('Greška pri dodavanju: ' + err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Jeste li sigurni da želite obrisati ovaj namještaj?')) return;
    try {
      await api.delete(`namjestaj/${id}/`);
      setNamjestaj(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      alert('Greška pri brisanju: ' + err.message);
    }
  }

  return (
    <div className="namjestaj-okvir">
      <h1>Pregled namještaja</h1>

      {user?.is_staff && (
        <button
          onClick={() => setAddModalOpen(true)}
          className="admin-buttons"
          style={{ marginBottom: 15 }}
        >
          Dodaj novi namještaj
        </button>
      )}

      <div className="filters-wrapper">
        <div className="filters-left">
          <div className="kategorija-selector">
            <label>Kategorija:</label>
            <select value={izabranaKategorija} onChange={e => setizabranaKategorija(e.target.value)}>
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="sort-selector">
            <label>Sortiraj po:</label>
            <select value={sortiranjeOpcija} onChange={e => setsortiranjeOpcija(e.target.value)}>
              <option value="A-Ž">Naziv A‑Ž</option>
              <option value="Ž-A">Naziv Ž‑A</option>
            </select>
          </div>
        </div>
        <div className="filters-right">
          <input
            type="text"
            placeholder="Pretraži po nazivu..."
            value={searchbar}
            onChange={e => setsearchbar(e.target.value)}
          />
        </div>
      </div>

      <div className="namjestaj-uniform-grid">
        {paginated.length === 0 && <p>Nema rezultata.</p>}
        {paginated.map(item => (
          <div key={item.id} className="namjestaj-karta">
            <Link
              to={`/namjestaj/${item.id}`}
              className="namjestaj-link"
              style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
            >
              <img src={getImageUrl(item.slika)} alt={`Namještaj: ${item.naziv}`} loading="lazy" />
              <h2>{item.naziv}</h2>
            </Link>
            {user?.is_staff && (
              <button
                onClick={() => handleDelete(item.id)}
                style={{
                  marginTop: 5,
                  background: 'red',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer'
                }}
              >
                Izbriši
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={() => goToPage(trenutnaStranica - 1)} disabled={trenutnaStranica === 1}>
          Prethodna
        </button>
        <span>Stranica {trenutnaStranica} od {totalPages}</span>
        <button onClick={() => goToPage(trenutnaStranica + 1)} disabled={trenutnaStranica === totalPages}>
          Sljedeća
        </button>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)}>
        <h2>Dodaj novi namještaj</h2>
        <form onSubmit={handleAddSubmit} className="modal-form">
          <label>Naziv:</label>
          <input
            type="text"
            required
            value={newItem.naziv}
            onChange={e => setNewItem({ ...newItem, naziv: e.target.value })}
          />
          <label>Opis:</label>
          <textarea
            required
            value={newItem.opis}
            onChange={e => setNewItem({ ...newItem, opis: e.target.value })}
          />
          <label>Kategorija:</label>
          <select
            value={newItem.kategorija}
            onChange={e => setNewItem({ ...newItem, kategorija: e.target.value })}
          >
            {categories.filter(c => c.value !== 'ALL').map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <label>Slika:</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setNewItem({ ...newItem, slika: e.target.files[0] })}
          />
          <label>Materijali:</label>
          <input
            type="text"
            value={newItem.materijali}
            onChange={e => setNewItem({ ...newItem, materijali: e.target.value })}
          />
          <label>Količina u skladištu:</label>
          <input
            type="number"
            min="0"
            value={newItem.kolicina_u_skladistu}
            onChange={e => setNewItem({ ...newItem, kolicina_u_skladistu: e.target.value })}
          />
          <button type="submit" className="modal-submit-button">Dodaj</button>
        </form>
      </Modal>
    </div>
  );
}

export default NamjestajStranica;
