# Uku Pacha Backend

API de cotizaciones para el sitio web de Uku Pacha. Recibe datos del formulario, guarda la cotizacion en Supabase PostgreSQL y devuelve una URL de WhatsApp con el mensaje listo para enviar.

## Tecnologias

- Node.js + Express
- PostgreSQL con `pg`
- Supabase PostgreSQL
- Railway
- Helmet
- CORS
- Express Rate Limit
- Express Validator

## Instalacion local

```bash
npm install
cp .env.example .env
npm run dev
```

Completa `.env` con tus valores reales antes de iniciar el servidor.

## Variables de entorno

| Variable | Descripcion |
| --- | --- |
| `DATABASE_URL` | URL de conexion PostgreSQL de Supabase. |
| `FRONTEND_URL` | URL publica del frontend en Vercel. |
| `WHATSAPP_NUMBER` | Numero de WhatsApp en formato internacional, solo digitos. |
| `PORT` | Puerto local o asignado por Railway. |
| `NODE_ENV` | `development` o `production`. |

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| `GET` | `/` | Estado basico de la API. |
| `GET` | `/health` | Verifica API y conexion a PostgreSQL. |
| `POST` | `/api/cotizaciones` | Crea una cotizacion y devuelve `whatsappUrl`. |
| `GET` | `/api/cotizaciones` | Lista cotizaciones registradas. |

### Ejemplo de POST

```json
{
  "nombre": "Juan Perez",
  "telefono": "+51 999 999 999",
  "correo": "juan@example.com",
  "servicio": "Vinilos Adhesivos",
  "mensaje": "Necesito una cotizacion para una vitrina."
}
```

## Supabase

Ejecuta `crear_tablas.sql` en el SQL Editor de Supabase. La tabla usa `BIGSERIAL`, `TIMESTAMPTZ` y es compatible con `RETURNING id`.

## Deploy en Railway

1. Crea un nuevo proyecto en Railway desde este repositorio.
2. Configura las variables de entorno de produccion.
3. Usa `npm start` como comando de inicio.
4. Verifica `https://tu-backend.up.railway.app/health`.

## CORS

La API acepta:

- `https://ukupacha-frontend.vercel.app`
- El valor de `FRONTEND_URL`
- `localhost` y `127.0.0.1` para desarrollo local

## Seguridad

- Headers HTTP seguros con Helmet.
- Rate limit global y especifico para cotizaciones.
- Validacion y sanitizacion de datos.
- Errores controlados en JSON.
- Logs compatibles con Railway.
