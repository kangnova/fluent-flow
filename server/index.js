require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Test Database Connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to PostgreSQL database');
  release();
});

// ==========================================
// ROUTES: Vocab Vault
// ==========================================

// 1. Get all vocabulary
app.get('/api/vocab', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vocab_vault ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2. Add new vocabulary
app.post('/api/vocab', async (req, res) => {
  try {
    const { word, definition, example_sentence, source_url, tags } = req.body;
    const newVocab = await pool.query(
      'INSERT INTO vocab_vault (word, definition, example_sentence, source_url, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [word, definition, example_sentence, source_url, tags]
    );
    res.json(newVocab.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3. Delete vocabulary
app.delete('/api/vocab/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM vocab_vault WHERE id = $1', [id]);
    res.json({ message: 'Vocabulary deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Basic Route
app.get('/', (req, res) => {
  res.send('FluentFlow API is running...');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
