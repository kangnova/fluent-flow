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

// 4. Update vocabulary
app.put('/api/vocab/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { word, definition, example_sentence, source_url, tags } = req.body;
    const updateVocab = await pool.query(
      'UPDATE vocab_vault SET word = $1, definition = $2, example_sentence = $3, source_url = $4, tags = $5 WHERE id = $6 RETURNING *',
      [word, definition, example_sentence, source_url, tags, id]
    );
    res.json(updateVocab.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// ROUTES: Practice Logs
// ==========================================

// 1. Get today's practice logs
app.get('/api/practice/today', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM practice_logs WHERE created_at = CURRENT_DATE'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 2. Get all practice logs (for history/journal)
app.get('/api/practice/all', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM practice_logs ORDER BY created_at DESC, id DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3. Add a practice log
app.post('/api/practice', async (req, res) => {
  try {
    const { activity_type, duration_minutes, content } = req.body;
    const newLog = await pool.query(
      'INSERT INTO practice_logs (activity_type, duration_minutes, content) VALUES ($1, $2, $3) RETURNING *',
      [activity_type, duration_minutes || 0, content || '']
    );
    res.json(newLog.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// ==========================================
// ROUTES: Statistics
// ==========================================

app.get('/api/stats', async (req, res) => {
  try {
    // 1. Get total vocab count
    const vocabCount = await pool.query('SELECT COUNT(*) FROM vocab_vault');
    
    // 2. Get distinct dates of practice logs
    const practiceDates = await pool.query(
      'SELECT DISTINCT created_at::date FROM practice_logs ORDER BY created_at DESC'
    );

    let streak = 0;
    if (practiceDates.rows.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const firstDate = new Date(practiceDates.rows[0].created_at);
      firstDate.setHours(0, 0, 0, 0);

      // Check if the most recent practice was today or yesterday
      const diffDays = Math.ceil((today - firstDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 1) {
        streak = 1;
        for (let i = 0; i < practiceDates.rows.length - 1; i++) {
          const current = new Date(practiceDates.rows[i].created_at);
          const next = new Date(practiceDates.rows[i + 1].created_at);
          
          const diff = Math.ceil((current - next) / (1000 * 60 * 60 * 24));
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    res.json({
      totalVocab: parseInt(vocabCount.rows[0].count),
      currentStreak: streak
    });
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
