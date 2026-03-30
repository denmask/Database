import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [listaPersone, setListaPersone] = useState([]);
  const [form, setForm] = useState({ nome: '', cognome: '', citta: '' });

  const caricaDati = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/utenti');
      setListaPersone(res.data);
    } catch (err) {
      console.error("Errore nel caricamento:", err);
    }
  };

  const eliminaPersona = async (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa persona?")) {
      try {
        await axios.delete(`http://localhost:5000/api/elimina/${id}`);
        caricaDati();
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
    } catch (err) {
      console.error("Errore nell'invio:", err);
    }
  };

  useEffect(() => {
    caricaDati();
  }, []);

  return (
    <div className="App">

      {/* HEADER */}
      <div className="app-header">
        <h1>
          Gestionale <span>Database</span> Persone
          <span className="count-badge">{listaPersone.length}</span>
        </h1>
        <span className="header-meta">MySQL · Express · React</span>
      </div>

      {/* FORM */}
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

      {/* TABLE */}
      <div className="section-label" style={{ marginBottom: 14 }}>Archivio persone</div>
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
            {listaPersone.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ border: 'none' }}>
                  <div className="empty-state">
                    <p>Nessun record nel database</p>
                  </div>
                </td>
              </tr>
            ) : (
              listaPersone.map((persona) => (
                <tr key={persona.id}>
                  <td>{persona.nome}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{persona.cognome}</td>
                  <td>
                    <span className="badge-citta">{persona.citta}</span>
                  </td>
                  <td>
                    <button
                      className="btn-elimina"
                      onClick={() => eliminaPersona(persona.id)}
                    >
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