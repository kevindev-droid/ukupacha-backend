const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const logger = require('../utils/logger');

const serviciosPermitidos = [
  'Vinilos Adhesivos',
  'Banners y Lonas',
  'Publicidad Mural',
  'Impresion Gran Formato',
  'Impresión Gran Formato',
  'Rotulacion Vehicular',
  'Rotulación Vehicular',
  'Senaletica y Rotulos',
  'Señalética y Rótulos'
];

const validarCotizacion = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ'.\-\s]+$/u).withMessage('El nombre solo puede contener letras'),

  body('telefono')
    .trim()
    .notEmpty().withMessage('El telefono es obligatorio')
    .matches(/^[0-9+\s-]{7,20}$/).withMessage('Telefono invalido'),

  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Correo electronico invalido')
    .normalizeEmail(),

  body('servicio')
    .trim()
    .notEmpty().withMessage('El servicio es obligatorio')
    .isLength({ max: 100 }).withMessage('El servicio no puede superar 100 caracteres')
    .isIn(serviciosPermitidos).withMessage('Servicio no valido'),

  body('mensaje')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 }).withMessage('El mensaje no puede superar 500 caracteres')
];

function getValidationError(req) {
  const errors = validationResult(req);
  return errors.isEmpty() ? null : errors.array()[0].msg;
}

function buildWhatsappUrl({ nombre, telefono, correo, servicio, mensaje }) {
  const whatsappNumber = (process.env.WHATSAPP_NUMBER || '').replace(/[^\d]/g, '');

  if (!whatsappNumber) {
    const error = new Error('WHATSAPP_NUMBER no esta configurado');
    error.status = 500;
    throw error;
  }

  const textoWhatsapp = [
    'Hola! Nueva cotizacion:',
    `Nombre: ${nombre}`,
    `Telefono: ${telefono}`,
    `Correo: ${correo}`,
    `Servicio: ${servicio}`,
    `Mensaje: ${mensaje || 'Sin mensaje'}`
  ].join('\n');

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textoWhatsapp)}`;
}

async function crearCotizacion(req, res, next) {
  try {
    const validationError = getValidationError(req);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { nombre, telefono, correo, servicio } = req.body;
    const mensaje = req.body.mensaje || '';

    const result = await db.query(
      `INSERT INTO cotizaciones
        (nombre, telefono, correo, servicio, mensaje)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, fecha`,
      [nombre, telefono, correo, servicio, mensaje]
    );

    const cotizacion = result.rows[0];
    const whatsappUrl = buildWhatsappUrl({ nombre, telefono, correo, servicio, mensaje });

    logger.info('Cotizacion creada', { id: cotizacion.id });

    return res.status(201).json({
      message: 'Cotizacion guardada correctamente',
      mensaje: 'Cotizacion guardada correctamente',
      id: cotizacion.id,
      fecha: cotizacion.fecha,
      whatsappUrl
    });
  } catch (error) {
    return next(error);
  }
}

async function obtenerCotizaciones(req, res, next) {
  try {
    const result = await db.query(
      `SELECT id, nombre, telefono, correo, servicio, mensaje, fecha
       FROM cotizaciones
       ORDER BY fecha DESC`
    );

    return res.json({ data: result.rows });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  crearCotizacion,
  obtenerCotizaciones,
  validarCotizacion
};
