require('dotenv').config();

const app = require('./src/app');
const { closePool, healthCheck } = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', async () => {
  logger.info(`API escuchando en el puerto ${PORT}`);

  try {
    await healthCheck();
    logger.info('Conexion a PostgreSQL verificada');
  } catch (error) {
    logger.error('No se pudo verificar PostgreSQL al iniciar', { error: error.message });
  }
});

function shutdown(signal) {
  logger.info(`Recibida senal ${signal}. Cerrando servidor...`);

  server.close(async () => {
    await closePool();
    logger.info('Servidor cerrado correctamente');
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
