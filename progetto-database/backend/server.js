const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURAZIONE DATABASE CON GESTIONE ERRORI
const poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS || "", // Se la password è vuota nel .env, usa stringa vuota
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const db = mysql.createPool(poolConfig);

// TEST DI CONNESSIONE IMMEDIATO (Così capiamo subito se i dati nel .env sono giusti)
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ ERRORE DI CONNESSIONE AL DATABASE:", err.message);
        console.log("Controlla che XAMPP sia acceso e che il nome del DB nel .env sia 'progetto_database'");
    } else {
        console.log("✅ DATABASE COLLEGATO! Il ponte tra codice e SQL è attivo.");
        connection.release(); // Libera la connessione
    }
});

// --- LE TUE QUERY ---

// 1. Leggi tutti gli utenti
app.get('/api/utenti', (req, res) => {
    const sql = "SELECT * FROM persone";
    db.query(sql, (errore, risultati) => {
        if (errore) {
            console.error("Errore nella query SELECT:", errore);
            return res.status(500).json(errore);
        }
        res.json(risultati);
    });
});

// 2. Aggiungi un nuovo utente
app.post('/api/aggiungi', (req, res) => {
    const { nome, cognome, citta } = req.body;
    const sql = "INSERT INTO persone (nome, cognome, citta) VALUES (?, ?, ?)";
    
    db.query(sql, [nome, cognome, citta], (errore, risultato) => {
        if (errore) {
            console.error("Errore nella query INSERT:", errore);
            return res.status(500).json(errore);
        }
        res.json({ messaggio: "Dati inseriti correttamente!", id: risultato.insertId });
    });
});

// 3. Statistiche per città
app.get('/api/statistiche', (req, res) => {
    const sql = "SELECT citta, COUNT(*) as totale FROM persone GROUP BY citta";
    db.query(sql, (errore, risultati) => {
        if (errore) {
            console.error("Errore nella query STATISTICS:", errore);
            return res.status(500).json(errore);
        }
        res.json(risultati);
    });
});
// 4. ELIMINA UN UTENTE
app.delete('/api/elimina/:id', (req, res) => {
    const idDaEliminare = req.params.id;
    const sqlElimina = "DELETE FROM persone WHERE id = ?";

    db.query(sqlElimina, [idDaEliminare], (errore, risultato) => {
        if (errore) return res.status(500).json(errore);
        res.json({ messaggio: "Utente rimosso con successo!" });
    });
});

const PORTA = process.env.PORT || 5000;
app.listen(PORTA, () => {
    console.log(`🚀 Server in ascolto sulla porta ${PORTA}`);
    console.log(`Fai le richieste a: http://localhost:${PORTA}/api/utenti`);
});