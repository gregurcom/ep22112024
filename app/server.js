const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post('/accounts', (req, res) => {
    const { number, totalMoney, ownerName } = req.body;

    console.log('Received data:', { number, totalMoney, ownerName });

    const query = 'INSERT INTO BankAccount (number, totalMoney, ownerName) VALUES (?, ?, ?)';
    db.query(query, [number, totalMoney, ownerName], (err, results) => {
        if (err) {
            console.error('Database query error:', err.message);
            res.status(500).json({ error: 'Database query failed' });
        } else {
            res.status(201).json({ message: 'Account created', id: results.insertId });
        }
    });
});


app.get('/accounts', (req, res) => {
    const query = 'SELECT * FROM BankAccount';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

app.get('/accounts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM BankAccount WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.length === 0) {
            res.status(404).json({ message: 'Account not found' });
        } else {
            res.json(results[0]);
        }
    });
});

app.put('/accounts/:id', (req, res) => {
    const { id } = req.params;
    const { number, totalMoney, ownerName } = req.body;
    const query = 'UPDATE BankAccount SET number = ?, totalMoney = ?, ownerName = ? WHERE id = ?';
    db.query(query, [number, totalMoney, ownerName, id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Account not found' });
        } else {
            res.json({ message: 'Account updated' });
        }
    });
});

app.delete('/accounts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM BankAccount WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: 'Account not found' });
        } else {
            res.json({ message: 'Account deleted' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
