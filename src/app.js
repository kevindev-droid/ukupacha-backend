const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const cotizacionRoutes = require('./routes/cotizacionRoutes');
const { healthCheck } = require('./config/database');
const errorHandler = require('./middlewares/errorHandler');
const notFound = require('./middlewares/notFound');
const logger = require('./utils/logger');

const app = express();

const allowedOrigins = new Set([
  'https://ukupacha-frontend.vercel.app',
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5500',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5500'
].filter(Boolean));

const localOriginPattern = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin) || localOriginPattern.test(origin)) {
      return callback(null, true);
    }

    logger.warn('Origen bloqueado por CORS', { origin });
    const error = new Error('Origen no permitido por CORS');
    error.status = 403;
    return callback(error);
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 204
};

app.set('trust proxy', 1);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiadas solicitudes. Intenta nuevamente mas tarde.' }
}));

app.get('/', (req, res) => {
  res.json({
    message: 'Uku Pacha API funcionando correctamente',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/health', async (req, res, next) => {
  try {
    await healthCheck();
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/cotizaciones', cotizacionRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
