# Logging Conventions

A concise guide to structured logging across the ecommerce application (backend, scripts, tests).

## 1. Goals
- Consistent, queryable structured logs
- Fast debugging & traceability (requestId / operationId)
- Safe handling of sensitive data (redaction + truncation)
- Low-noise, high-signal events

## 2. Logger Overview
Central logger: `server/logger.js` (Pino)
- Pretty output in non-production
- Redaction for secrets (password, tokens, apiKey, etc.)
- Helper: `getLog(req, extra?)` returns a base or child logger injecting context
- Middleware injects `requestId` for HTTP requests

## 3. Event Naming Pattern
`<domain>.<action>[.<detail>]`

Examples:
- `order.create.start`, `order.create.success`, `order.create.error`
- `square.createPayment.request`, `square.createPayment.success`
- `auth.login.attempt`, `auth.login.success`, `auth.login.badPassword`
- `messages.cleanup.old`, `messages.cleanup.limit.applied`
- `script.purgeTokens.summary`, `script.cleanupArchived.deleted`
- `schedule.archivedOrders.start`, `schedule.archivedOrders.completed`
- `email.orderConfirmation.sent`, `email.send.error`

Keep verbs consistent: `start`, `attempt`, `success`, `error`, `deleted`, `updated`, `none` (when nothing to do), `summary` (aggregated results).

## 4. Log Levels Usage
| Level | When to Use | Examples |
|-------|-------------|----------|
| trace | Extremely verbose internal dev tracing (rare) | Deep Square SDK payload (avoid in prod) |
| debug | Helpful diagnostic metadata not always needed | API key prefixes, branch decisions |
| info  | Normal lifecycle events & outcomes | create/update success, cleanup summary |
| warn  | Recoverable anomalies / validation failures | login noUser, inactive account |
| error | Failures impacting operation or user path | DB errors, external API failures |
| fatal | (Reserved) Unrecoverable system crash | Initialization crash |

## 5. Correlation & Context
- `requestId` automatically added for HTTP requests via middleware
- `operationId` manually supplied for background jobs, scripts, test harnesses
- Always add minimal identifying fields: `orderId`, `userId`, `email`, `status`, counts
- Avoid dumping entire objects; summarize (e.g., image metadata count, token counts)

## 6. Error Logging Pattern
Structure:
```js
log.error({ event: 'order.create.error', err: err.message, code: err.code }, 'Failed to create order');
```
Guidelines:
- Include `event` every time
- Prefer `err: err.message` and add `stack` only if actively debugging (or rely on pino error serializer if enabled)
- If external API: include `provider`, `statusCode`, `attempt`

## 7. Sensitive Data Handling
- NEVER log raw passwords, full tokens, full API keys
- Show only prefixes for debugging: `apiKeyPrefix: key.slice(0,6)`
- Ensure redaction list in logger includes new secret fields if added
- Avoid logging full request bodies—log selected fields

## 8. Background Tasks & Scripts
Use `operationId` to correlate multi-step flows:
```js
const log = getLog(null, { operationId: 'cleanupArchivedOrders' });
log.info({ event: 'script.cleanupArchived.start', cutoffDate }, 'Starting cleanup');
```
Emit start → zero/updated/deleted → summary/done events.

## 9. Test Scripts
Namespace: `test.*`
Examples: `test.sendgrid.start`, `test.email.success`, `test.adminAlert.error`
Keep them succinct; include messageId or recipient counts.

## 10. Migration Checklist
When refactoring a file:
- Replace every console.* with logger call
- Add/import `getLog`
- Decide context source: `req` or `operationId`
- Ensure each logical path emits an `event`
- Add `error` event for catch blocks
- Confirm no sensitive data leaked
- Run lint / basic execution if possible

## 11. Examples
HTTP handler:
```js
const log = getLog(req, { feature: 'orderStatus' });
log.info({ event: 'order.status.update.attempt', orderId, toStatus }, 'Updating order status');
// ...
log.info({ event: 'order.status.update.success', orderId, toStatus }, 'Order status updated');
```

Script:
```js
const log = getLog(null, { operationId: 'purgeEmptyTokens' });
log.info({ event: 'script.purgeTokens.start' }, 'Starting token purge');
// ... work
log.info({ event: 'script.purgeTokens.summary', removedEmpty, removedExpiredOrInvalid }, 'Token purge complete');
```

Auth strategy:
```js
log.info({ event: 'auth.login.attempt', email });
log.warn({ event: 'auth.login.badPassword', email });
log.info({ event: 'auth.login.success', email, userId: user._id });
```

Scheduler:
```js
log.info({ event: 'schedule.archivedOrders.start', at: new Date().toISOString() });
```

## 12. Anti-Patterns to Avoid
- Logging huge objects (use counts/keys instead)
- Multiple different `event` names for same semantic action
- Using `error` level for expected empty results
- Omitting correlation (no requestId or operationId) in multi-step flows

## 13. Adding New Domains
1. Pick a stable domain prefix (`inventory`, `report`, `email`, etc.)
2. Draft action verbs; keep them short
3. Implement start/success/error pattern
4. Add summary event if multi-entity changes occur

## 14. Quick Reference (Cheat Sheet)
| Scenario | Event Example |
|----------|---------------|
Create success | `order.create.success` |
No results     | `messages.fetch.none` |
External call  | `square.createPayment.request` / `.success` / `.error` |
Background cleanup | `script.cleanupArchived.deleted` |
Scheduler start | `schedule.archivedOrders.start` |
Auth failed (password) | `auth.login.badPassword` |

---
Keep it intentional, minimal, and structured. When in doubt: add a clear `event`, include key identifiers, and avoid noise.
