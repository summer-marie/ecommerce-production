// Centralized logger. In production (unless VITE_KEEP_CONSOLE=true) most logs become no-ops.
const MODE = import.meta.env.MODE;
const KEEP = import.meta.env.VITE_KEEP_CONSOLE === 'true';
const isDevLike = MODE === 'development' || MODE === 'staging';

const noop = () => {};

// Decide which levels remain active
const enableVerbose = isDevLike || KEEP;

export const logger = {
  log: enableVerbose ? console.log.bind(console, '[LOG]') : noop,
  info: enableVerbose ? console.info.bind(console, '[INFO]') : noop,
  debug: enableVerbose ? console.debug.bind(console, '[DEBUG]') : noop,
  warn: console.warn.bind(console, '[WARN]'), // keep warnings
  error: console.error.bind(console, '[ERROR]'), // keep errors
};

export default logger;
