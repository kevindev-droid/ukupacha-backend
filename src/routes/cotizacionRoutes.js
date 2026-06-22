const express = require('express');
const rateLimit = require('express-rate-limit');
const {
  crearCotizacion,
  obtenerCotizaciones,
  validarCotizacion
} = require('../controllers/cotizacionController');

const router = express.Router();

const crearCotizacionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Limite de cotizaciones alcanzado. Intenta nuevamente en una hora.' }
});

const listarCotizacionesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta nuevamente mas tarde.' }
});

router.post('/', crearCotizacionLimiter, validarCotizacion, crearCotizacion);
router.get('/', listarCotizacionesLimiter, obtenerCotizaciones);

module.exports = router;
