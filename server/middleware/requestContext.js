import { v4 as uuid } from 'uuid';
import { withRequestContext } from '../utils/logger.js';

export function requestContext(req, res, next) {
  const start = process.hrtime.bigint();
  const requestId = req.headers['x-request-id'] || uuid();
  req.id = requestId;
  req.log = withRequestContext({ requestId });

  // Log inbound request (lightweight)
  req.log.info({
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
  }, 'request.start');

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1e6;
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
    req.log[level]({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Math.round(durationMs),
      contentLength: res.getHeader('content-length'),
    }, 'request.complete');
  });

  next();
}
