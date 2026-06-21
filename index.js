const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const cotizacionRoutes = require('./src/routes/cotizacionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// SEGURIDAD — Headers HTTP
app.use(helmet());

// SEGURIDAD — CORS restringido
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://127.0.0.1:5500',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};
app.use(cors(corsOptions));

// SEGURIDAD — Rate limiting global
const limiterGlobal = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Demasiadas solicitudes, intenta más tarde.' }
});
app.use(limiterGlobal);

// SEGURIDAD — Rate limiting estricto para cotizaciones (POST)
const limiterCotizacionesPost = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Límite de cotizaciones alcanzado, intenta en una hora.' },
  skip: (req) => req.method !== 'POST'
});

// SEGURIDAD — Rate limiting para GET de cotizaciones
const limiterCotizacionesGet = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Demasiadas solicitudes, intenta más tarde.' },
  skip: (req) => req.method !== 'GET'
});

app.use('/api/cotizaciones', limiterCotizacionesPost);
app.use('/api/cotizaciones', limiterCotizacionesGet);

app.use(express.json({ limit: '10kb' }));

app.use('/api', cotizacionRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'Uku Pacha API funcionando correctamente' });
});

// SEGURIDAD — Middleware de error global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: 'Error interno del servidor. Por favor intenta más tarde.' 
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});