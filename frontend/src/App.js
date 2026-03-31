import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [listaPersone, setListaPersone] = useState([]);
  const [statistiche, setStatistiche] = useState([]);
  const [form, setForm] = useState({ nome: '', cognome: '', citta: '' });
  const [ricerca, setRicerca] = useState('');

  const caricaDati = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/utenti');
      setListaPersone(res.data);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
    }
  };

  const caricaStatistiche = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/statistiche');
      setStatistiche(res.data);
    } catch (err) {
      console.error("Errore statistiche:", err);
    }
  };

  const eliminaPersona = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa persona?")) {
      try {
        await axios.delete(`http://localhost:5000/api/elimina/${id}`);
        caricaDati();
        caricaStatistiche();
      } catch (err) {
        alert("Errore durante l'eliminazione");
      }
    }
  };

  const inviaDati = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/aggiungi', form);
      setForm({ nome: '', cognome: '', citta: '' });
      caricaDati();
      caricaStatistiche();
    } catch (err) {
      console.error("Errore nell'invio:", err);
    }
  };

  useEffect(() => {
    caricaDati();
    caricaStatistiche();
  }, []);

  const personeFiltrate = listaPersone.filter(p =>
    p.nome.toLowerCase().includes(ricerca.toLowerCase()) ||
    p.cognome.toLowerCase().includes(ricerca.toLowerCase()) ||
    p.citta.toLowerCase().includes(ricerca.toLowerCase())
  );

  const maxTotale = statistiche.length > 0 ? Math.max(...statistiche.map(s => s.totale)) : 1;

  const COLORI = ['#e8622a', '#1a9e8f', '#7c4dce', '#e8a62a', '#2a7ce8', '#ce4d7c', '#4dce7c'];

  return (
    <div className="App">

      <div className="app-header">
        <h1>
          Gestionale <span>Database</span> Persone
          <span className="count-badge">{listaPersone.length}</span>
        </h1>
        <span className="header-meta">MySQL · Express · React</span>
      </div>

      <div className="section-label">Inserisci nuovo record</div>
      <form onSubmit={inviaDati} className="modulo-inserimento">
        <div className="form-row">
          <input
            type="text"
            placeholder="Nome"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Cognome"
            value={form.cognome}
            onChange={e => setForm({ ...form, cognome: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Città"
            value={form.citta}
            onChange={e => setForm({ ...form, citta: e.target.value })}
            required
          />
          <button type="submit">+ Aggiungi</button>
        </div>
      </form>

      {statistiche.length > 0 && (
        <div className="stats-section">
          <div className="section-label" style={{ marginBottom: 14 }}>Distribuzione per città</div>
          <div className="stats-card">
            {statistiche.map((s, i) => (
              <div className="stat-row" key={s.citta}>
                <span className="stat-citta">{s.citta}</span>
                <div className="stat-bar-track">
                  <div
                    className="stat-bar-fill"
                    style={{
                      width: `${(s.totale / maxTotale) * 100}%`,
                      background: COLORI[i % COLORI.length]
                    }}
                  />
                </div>
                <span className="stat-count" style={{ color: COLORI[i % COLORI.length] }}>
                  {s.totale}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="archivio-header">
        <div className="section-label" style={{ marginBottom: 0 }}>Archivio persone</div>
        <div className="search-wrapper">
          <svg className="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Cerca per nome, cognome o città..."
            value={ricerca}
            onChange={e => setRicerca(e.target.value)}
          />
          {ricerca && (
            <button className="search-clear" onClick={() => setRicerca('')}>✕</button>
          )}
        </div>
      </div>

      <div className="tabella-wrapper">
        <table className="tabella-elegante">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Cognome</th>
              <th>Città</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {personeFiltrate.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ border: 'none' }}>
                  <div className="empty-state">
                    {ricerca ? `Nessun risultato per "${ricerca}"` : 'Nessun record nel database'}
                  </div>
                </td>
              </tr>
            ) : (
              personeFiltrate.map((persona) => (
                <tr key={persona.id}>
                  <td>{persona.nome}</td>
                  <td>{persona.cognome}</td>
                  <td>
                    <span className="badge-citta">{persona.citta}</span>
                  </td>
                  <td>
                    <button className="btn-elimina" onClick={() => eliminaPersona(persona.id)}>
                      Elimina
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;