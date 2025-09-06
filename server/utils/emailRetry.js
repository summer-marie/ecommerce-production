/**
 * Simple exponential backoff retry helper for async functions.
 * opts: { retries: number, baseDelay: number }
 */
export async function withRetry(fn, { retries = 3, baseDelay = 500 } = {}) {
  let attempt = 0;
  let lastError;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      attempt += 1;
      if (attempt > retries || !isRetryableEmailError(err)) break;
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.floor(Math.random() * 100);
      await new Promise((res) => setTimeout(res, delay));
    }
  }
  throw lastError;
}

function isRetryableEmailError(err) {
  // Network-ish errors
  const netCodes = new Set(["ETIMEDOUT", "ECONNRESET", "EAI_AGAIN", "ENOTFOUND"]);
  if (err && (netCodes.has(err.code) || /timed out/i.test(err.message || ""))) return true;

  // SMTP transient response codes (4xx often transient)
  const code = err?.responseCode;
  if (code && Number(code) >= 400 && Number(code) < 500) return true;

  return false;
}
