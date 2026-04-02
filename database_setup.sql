-- ==========================================
-- SCRIPT SETUP DATABASE: FluentFlow
-- ==========================================

-- LANGKAH 1: Jalankan perintah ini di 'Query Tool' SQL Browser Anda.
-- (Pastikan Anda terhubung ke server PostgreSQL default terlebih dahulu)

CREATE DATABASE fluent_flow;

-- ==========================================
-- LANGKAH 2: Pindah ke database 'fluent_flow'
-- Jika menggunakan pgAdmin: Klik kanan database 'fluent_flow' -> Query Tool.
-- Kemudian jalankan baris di bawah ini:
-- ==========================================

-- Tabel untuk menyimpan kosakata (Vocab Vault)
CREATE TABLE IF NOT EXISTS vocab_vault (
    id SERIAL PRIMARY KEY,
    word VARCHAR(100) NOT NULL,
    definition TEXT,
    example_sentence TEXT,
    source_url TEXT,
    tags VARCHAR(255), -- Free-text tags separated by comma
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel untuk log jurnal & latihan harian
CREATE TABLE IF NOT EXISTS practice_logs (
    id SERIAL PRIMARY KEY,
    activity_type VARCHAR(50), -- 'Self-Talk', 'Reading', 'Shadowing'
    content TEXT, -- Isi jurnal atau catatan
    duration_minutes INTEGER,
    created_at DATE DEFAULT CURRENT_DATE
);

-- Optional: Tambahkan data contoh awal
INSERT INTO vocab_vault (word, definition, tags, example_sentence) 
VALUES ('React', 'A JavaScript library for building user interfaces.', 'Frontend, JS', 'Learning React is fun!');
