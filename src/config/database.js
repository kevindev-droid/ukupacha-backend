const { Pool } = require('pg');
const logger = require('../utils/logger');

const { DATABASE_URL = '', NODE_ENV = 'development' } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL no esta configurada');
}

function shouldUseSsl(connectionString) {
  if (/localhost|127\.0\.0\.1/i.test(connectionString)) {
    return false;
  }

  return NODE_ENV === 'production' || /supabase/i.test(connectionString);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: shouldUseSsl(DATABASE_URL) ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (error) => {
  logger.error('Error inesperado en la pool de PostgreSQL', { error: error.message });
});

async function query(text, params = []) {
  return pool.query(text, params);
}

async function healthCheck() {
  await query('SELECT 1');
}

async function closePool() {
  await pool.end();
}

module.exports = {
  query,
  healthCheck,
  closePool,
  pool
};
