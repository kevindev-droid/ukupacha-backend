const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Error en la pool de conexión:', err);
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback);
  }
};