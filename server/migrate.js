require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const migrate = async () => {
  try {
    console.log('Starting database migration...');
    
    // Create Vocab Vault Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vocab_vault (
        id SERIAL PRIMARY KEY,
        word VARCHAR(100) NOT NULL,
        definition TEXT,
        example_sentence TEXT,
        source_url TEXT,
        tags VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Table "vocab_vault" checked/created.');

    // Create Practice Logs Table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS practice_logs (
        id SERIAL PRIMARY KEY,
        activity_type VARCHAR(50),
        content TEXT,
        duration_minutes INTEGER,
        created_at DATE DEFAULT CURRENT_DATE
      );
    `);
    console.log('Table "practice_logs" checked/created.');

    console.log('Migration successful!');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
};

migrate();
