# Uku Pacha — Backend API

Backend de la página web de **Uku Pacha Diseño y Publicidad**. Construido con Node.js, Express y MySQL.

## Tecnologías
- Node.js + Express
- MySQL2
- Helmet (seguridad HTTP)
- Express Rate Limit (protección contra ataques)
- Express Validator (validación de datos)
- Dotenv

## Instalación

1. Clona el repositorio
2. Instala las dependencias:

npm install

3. Copia el archivo de variables de entorno:

cp .env.example .env

4. Completa los valores en `.env` con tus datos reales
5. Crea la base de datos en MySQL ejecutando `crear_tablas.sql`
6. Inicia el servidor:

npm run dev

## Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | / | Verificar que el servidor funciona |
| POST | /api/cotizaciones | Crear nueva cotización |
| GET | /api/cotizaciones | Listar todas las cotizaciones |

## Seguridad
- Rate limiting: máximo 100 requests cada 15 minutos por IP
- Rate limiting estricto en cotizaciones: máximo 5 por hora por IP
- Validación y sanitización de todos los campos del formulario
- Headers de seguridad HTTP con Helmet
- CORS restringido al dominio del frontend

## Variables de entorno necesarias
Ver `.env.example`