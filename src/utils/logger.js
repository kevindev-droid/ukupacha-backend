function write(level, message, meta = {}) {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta
  };

  if (process.env.NODE_ENV === 'production') {
    console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](JSON.stringify(payload));
    return;
  }

  const metaText = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](`[${payload.timestamp}] ${level.toUpperCase()}: ${message}${metaText}`);
}

module.exports = {
  info(message, meta) {
    write('info', message, meta);
  },
  warn(message, meta) {
    write('warn', message, meta);
  },
  error(message, meta) {
    write('error', message, meta);
  }
};
