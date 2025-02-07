const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());



// MySQL Connection
const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'react_items',
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.message);
        process.exit(1); // Exit if connection fails
    } else {
        console.log('Connected to MySQL database.');
    }
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to MySQL:', err.message);
        return;
    }
    console.log('Connected to MySQL database.');
});

// API Endpoints

// Get all items
app.get('/items', (req, res) => {
    const query = 'SELECT * FROM items ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server error');
        } else {
            res.json(results);
        }
    });
});

// Add a new item
app.post('/items', (req, res) => {
    const { text } = req.body;
    if (!text) {
        return res.status(400).send('Text is required');
    }

    const query = 'INSERT INTO items (text) VALUES (?)';
    db.query(query, [text], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.json({ id: result.insertId, text });
        }
    });
});

// Update an item
app.put('/items/:id', (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    if (!text) {
        return res.status(400).send('Text is required');
    }

    const query = 'UPDATE items SET text = ? WHERE id = ?';
    db.query(query, [text, id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.send('Item updated successfully');
        }
    });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;

    const query = 'DELETE FROM items WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Server error');
        } else {
            res.send('Item deleted successfully');
        }
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
