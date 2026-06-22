const logger = require('../utils/logger');

function errorHandler(error, req, res, next) {
  const status = error.status || error.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  logger.error('Error en request', {
    method: req.method,
    path: req.originalUrl,
    status,
    error: error.message
  });

  res.status(status).json({
    error: status >= 500 && isProduction
      ? 'Error interno del servidor. Intenta nuevamente mas tarde.'
      : error.message
  });
}

module.exports = errorHandler;
