CREATE TABLE IF NOT EXISTS public.cotizaciones (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  servicio VARCHAR(100) NOT NULL,
  mensaje TEXT,
  fecha TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cotizaciones_fecha
  ON public.cotizaciones (fecha DESC);
