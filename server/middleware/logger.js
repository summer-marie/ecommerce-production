// Deprecated Winston logger file now bridged to Pino implementation.
// Kept temporarily to avoid breaking imports while migration completes.
import { logger } from '../utils/logger.js';

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  logger.info({ event: 'http.request', method: req.method, url: req.url });
  const originalEnd = res.end;
  res.end = function (chunk, encoding) {
    const duration = Date.now() - start;
    logger.info({ event: 'http.response', method: req.method, url: req.url, statusCode: res.statusCode, duration });
    originalEnd.call(this, chunk, encoding);
  };
  next();
};

export const errorLogger = (err, req, res, next) => {
  logger.error({ event: 'http.error', method: req.method, url: req.url, err: err.message, stack: process.env.NODE_ENV === 'production' ? undefined : err.stack });
  res.status(err.status || 500).json({ success: false, message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' });
};

export const logInfo = (message, meta = {}) => logger.info(meta, message);
export const logError = (message, meta = {}) => logger.error(meta, message);
export const logWarn = (message, meta = {}) => logger.warn(meta, message);
export const logDebug = (message, meta = {}) => logger.debug(meta, message);

export default logger;
