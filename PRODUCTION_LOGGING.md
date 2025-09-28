# Production Logging Guide

This application uses **Pino** (`server/utils/logger.js`) as the single structured logging system.

## Objectives
- Consistent, structured JSON logs for ingestion by log platforms.
- Low overhead in production (no pretty printing).
- Correlation across requests via `requestId` and background tasks via `operationId`.
- Safe output (sensitive fields redacted by Pino configuration).

## Log Structure (Examples)
```
{"level":30,"time":1732739200000,"msg":"Environment variables loaded successfully","requestId":"..."}
{"level":30,"time":1732739210000,"event":"http.request","method":"GET","url":"/orders","requestId":"..."}
{"level":30,"time":1732739210052,"event":"http.response","method":"GET","url":"/orders","statusCode":200,"duration":52,"requestId":"..."}
{"level":50,"time":1732739220000,"msg":"Unhandled route error","err":{"message":"Boom"},"requestId":"..."}
```

## File Locations
- Logger implementation: `server/utils/logger.js`
- Request context (adds requestId): `server/middleware/requestContext.js`

## Best Practices
1. Prefer `logger.info({ key: value }, "Message")` rather than embedding dynamic values inside the string.
2. Use `logger.warn` for degraded behavior, not user errors that are expected.
3. Use `logger.error` for failures that return 4xx/5xx.
4. Use `logger.fatal` only for process-ending conditions.
5. Avoid logging secrets or large blobs (truncate or summarize instead).

## Redaction
Sensitive fields should be redacted in `server/utils/logger.js` using Pino's `redact` option. Add keys there if new secrets are introduced.

## Shipping Logs (Choose One)
### 1. Railway / Platform Native
If the platform captures stdout/stderr (Railway, Render, Fly.io), do nothing—logs are already centralized.

### 2. Vector / Fluent Bit Sidecar
Run a lightweight collector to ship stdout to Loki, Elasticsearch, or OpenSearch.
- Configure container to write JSON (default).
- Point sidecar to container stdout stream.

### 3. Logtail / BetterStack
Use a small transport only in production:
```js
// Pseudo-example if you later add a transport file
if (process.env.LOGTAIL_SOURCE_TOKEN) {
  const { Logtail } = await import("@logtail/node");
  const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);
  logger.info({ transport: "logtail" }, "Logtail transport initialized");
}
```
Keep the main logger synchronous JSON; offload network I/O to a background process if added.

### 4. Datadog
Set `DD_API_KEY` and deploy with the Datadog agent. Configure log collection from stdout. Add `DD_SERVICE`, `DD_ENV`, and `DD_VERSION` for richer tags.

## Correlation & Tracing
- Each incoming HTTP request gets a `requestId` (crypto.randomUUID).
- Background scripts / cron tasks should generate an `operationId` (helper available in `getLog()` pattern if added later).
- Include upstream IDs (e.g., `squareOrderId`) in structured fields instead of message string.

## Performance Notes
Pino is extremely fast; avoid wrapping it in async transports in the request hot path. If you must post-process logs, use a separate consumer or platform pipeline.

## Local Development
Pretty printing is enabled automatically (pino-pretty) when `NODE_ENV !== 'production'`.

## Migration Cleanup (Completed)
- Removed legacy Winston bridge `middleware/logger.js`.
- All modules now import `{ logger }` from `server/utils/logger.js`.
- Helper wrappers (logInfo/logWarn/logError) eliminated to reduce API surface.

## Adding New Logs Checklist
- Is the level appropriate? (info vs warn vs error)
- Are structured fields used instead of string interpolation?
- Are you leaking PII/secrets? (mask or remove)
- Will the log volume be acceptable? (avoid tight loops or per-item logs in bulk jobs)

## Future Enhancements (Optional)
- Add OpenTelemetry trace/span IDs into log context for deeper correlation.
- Implement log sampling for very noisy endpoints.
- Add a lightweight metrics exporter (Prometheus) and correlate logs via labels.

---
Questions or improvements? Open a PR updating this file.
