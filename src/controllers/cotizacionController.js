const db = require('../config/database');
const { body, validationResult } = require('express-validator');

const validarCotizacion = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ min: 2, max: 100 }).withMessage('El nombre debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/).withMessage('El nombre solo puede contener letras'),

  body('telefono')
    .trim()
    .notEmpty().withMessage('El teléfono es obligatorio')
    .matches(/^[0-9+\s\-]{7,20}$/).withMessage('Teléfono inválido'),

  body('correo')
    .trim()
    .notEmpty().withMessage('El correo es obligatorio')
    .isEmail().withMessage('Correo electrónico inválido')
    .normalizeEmail(),

  body('servicio')
    .trim()
    .notEmpty().withMessage('El servicio es obligatorio')
    .isIn([
      'Vinilos Adhesivos',
      'Banners y Lonas',
      'Publicidad Mural',
      'Impresión Gran Formato',
      'Rotulación Vehicular',
      'Señalética y Rótulos'
    ]).withMessage('Servicio no válido'),

  body('mensaje')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('El mensaje no puede superar 500 caracteres')
];

const crearCotizacion = (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ error: errores.array()[0].msg });
  }

  const { nombre, telefono, correo, servicio, mensaje } = req.body;

  const query = `INSERT INTO cotizaciones (nombre, telefono, correo, servicio, mensaje) 
                 VALUES (?, ?, ?, ?, ?)`;

  db.query(query, [nombre, telefono, correo, servicio, mensaje || ''], (err, result) => {
    if (err) {
      console.error('Error guardando cotización:', err);
      return res.status(500).json({ error: 'Error al guardar la cotización' });
    }

    // SEGURIDAD — URL encoding correcto para WhatsApp
    const textoWhatsapp = `Hola! Nueva cotización:\nNombre: ${nombre}\nTeléfono: ${telefono}\nCorreo: ${correo}\nServicio: ${servicio}\nMensaje: ${mensaje || 'Sin mensaje'}`;
    const whatsappUrl = `https://wa.me/${process.env.WHATSAPP_NUMBER}?text=${encodeURIComponent(textoWhatsapp)}`;

    res.status(201).json({
      mensaje: 'Cotización guardada correctamente',
      whatsappUrl: whatsappUrl,
      id: result.insertId
    });
  });
};

const obtenerCotizaciones = (req, res) => {
  db.query('SELECT * FROM cotizaciones ORDER BY fecha DESC', (err, results) => {
    if (err) {
      console.error('Error al obtener cotizaciones:', err);
      return res.status(500).json({ error: 'Error al obtener cotizaciones' });
    }
    res.json(results);
  });
};

module.exports = { crearCotizacion, obtenerCotizaciones, validarCotizacion };