const express = require('express');
const router = express.Router();
const { crearCotizacion, obtenerCotizaciones, validarCotizacion } = require('../controllers/cotizacionController');

router.post('/cotizaciones', validarCotizacion, crearCotizacion);
router.get('/cotizaciones', obtenerCotizaciones);

module.exports = router;