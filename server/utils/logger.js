import pino from 'pino';

// Determine environment
const env = process.env.NODE_ENV || 'development';
const level = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug');

// Redaction list (extend as needed)
const REDACT_PATHS = [
  'password',
  '*.password',
  'req.headers.authorization',
  '*.token',
  'token',
  '*.apiKey',
  'apiKey'
];

export const logger = pino({
  level,
  redact: {
    paths: REDACT_PATHS,
    censor: '[REDACTED]'
  },
  base: {
    service: 'ecommerce-backend',
    env,
  },
  transport: env !== 'production' ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  } : undefined,
});

// Create a child logger with request context
export function withRequestContext(meta = {}) {
  return logger.child(meta);
}

// Helper: obtain a logger tied to a request if available, else a transient operation logger
export function getLog(req, extra = {}) {
  if (req && req.log) {
    return req.log.child(extra);
  }
  // Fallback: create an operationId for background or detached flows
  const operationId = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return logger.child({ operationId, ...extra });
}

// Helper to format errors consistently
export function serializeError(err) {
  if (!err) return undefined;
  return {
    message: err.message,
    name: err.name,
    stack: env === 'production' ? undefined : err.stack,
    code: err.code,
  };
}

// Convenience wrappers (optional, can call logger.* directly)
export const log = {
  debug: (msg, obj) => logger.debug(obj || {}, msg),
  info: (msg, obj) => logger.info(obj || {}, msg),
  warn: (msg, obj) => logger.warn(obj || {}, msg),
  error: (msg, obj) => logger.error(obj || {}, msg),
  fatal: (msg, obj) => logger.fatal(obj || {}, msg),
};

export default logger;
