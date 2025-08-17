# Square Account Setup & Integration Guide (Owner + Developer Collaboration)

This guide walks the BUSINESS OWNER through creating and configuring their Square account for the pizza ordering site, and shows how the DEVELOPER links in securely without sharing passwords. Follow phases in order.

---
## PHASE 0: Roles & Goal
- Owner: Controls the real Square Business (bank, production credentials, compliance).
- Developer: Implements integration (sandbox + production switch), may need limited dashboard access or uses OAuth.
- Goal: Charge cards via Square, update orders, and receive webhooks for payment status.

---
## PHASE 1: Owner – Create / Verify Square Business Account
1. Go to https://squareup.com/signup
2. Enter business email, password, business details.
3. Complete identity (KYC) verification (Gov ID / business info as prompted).
4. Link bank account: Dashboard → Balance → Transfers → Add Bank.
5. Add or verify at least one Business Location: Dashboard → Account & Settings → Business → Locations.
   - Note the Location Name; the system uses its Location ID later.

---
## PHASE 2: Owner – (If Not Already) Enable Developer Dashboard Access
1. Visit https://developer.squareup.com/apps and sign in with the SAME credentials (no new account needed).
2. Accept developer terms if prompted.
3. You’ll see a default Sandbox test data set auto-created; this is normal.

---
## PHASE 3: Owner – Create the Application (Recommended Owner-Owned)
(You already have a developer account, but best practice is the OWNER creates the production application so secrets never leave their control.)
1. Developer Dashboard → “+ Create Application”.
2. Name: e.g. `Pizza Online Ordering`.
3. Open the app; you’ll see two tabs: Sandbox / Production.
4. DO NOT send the Production Access Token in plaintext email or chat.

(Alternative: Developer creates the app in their own developer organization and uses OAuth to connect the Owner’s merchant; more complex—only needed for multi-merchant SaaS. For a single store, Owner-owned app is simpler.)

---
## PHASE 4: Owner – Gather Required Values (Sandbox First)
Inside the application (Sandbox tab):
- Sandbox Access Token (SECRET — server only). Format: `EAAA...`
- Sandbox Application ID (PUBLIC if ever needed client-side).
- Location ID: Developer Dashboard → Locations or Business Dashboard → Locations (choose the Sandbox location). Copy the alphanumeric ID.

Repeat for Production later (switch to Production tab at top of the app page):
- Production Access Token.
- Production Application ID.
- Production Location ID.

> Tip: Store these in a secure password manager (1Password, Bitwarden, Keeper) and share with the developer via secure item sharing – NEVER plain chat/text.

---
## PHASE 5: Developer – Configure Server Environment (.env)
Add (or update) the server `.env` file (NOT the frontend) with sandbox values first:
```
SQUARE_ENVIRONMENT=sandbox
SQUARE_ACCESS_TOKEN=EAAA_SANDBOX_ACCESS_TOKEN
SQUARE_LOCATION_ID=SANDBOX_LOCATION_ID
SQUARE_WEBHOOK_SIGNATURE_KEY= # (add after Phase 7)
# Existing application vars
JWT_SECRET=...
MONGODB_URL=...
SESSION_SECRET=...
COOKIE_SECRET=...
WHITELISTED_DOMAINS=http://localhost:5173,http://127.0.0.1:5173,https://YOUR_PRODUCTION_DOMAIN
```
Frontend dev `.env` (Vite) should only need:
```
VITE_API_SERVER_URL=http://localhost:8010
```
Never expose `SQUARE_ACCESS_TOKEN` client-side.

---
## PHASE 6: Linking Developer Access to Owner Account
Choose ONE of these models:

### Option A (Simple – Shared App, No Extra Dashboard Access)
Owner securely sends ONLY sandbox + production tokens & location IDs to developer. Developer never logs into the Square Dashboard. Suitable when trust is high and minimal dashboard operations are needed.

### Option B (Team Member Access in Square Business Dashboard)
1. Owner logs into Business Dashboard: https://squareup.com/dashboard
2. Go to: Team → Team Members → Add Team Member.
3. Enter developer’s name & email.
4. Permissions: Enable a custom permission set with at least:
   - “View sales reports” (optional if you want the developer to debug transactions)
   - “Access Developer Tools” (if available in region) / Or add them to a role granting access to the **Developer Dashboard**.
5. Developer accepts email invite, creates/links their Square profile.
6. Developer logs into https://developer.squareup.com/apps — they now see the Owner’s application (if properly granted). If not visible: ensure Team role includes “Developer” / “Manage applications” style permission (Square occasionally renames this; look for anything referencing “Developer” or “Apps”).
7. Owner can still keep Production Access Token hidden: Developer can create Sandbox credentials but must request Production token when ready to go live.

### Option C (OAuth Flow – Advanced / Multi-Merchant)
Use only if building a platform for multiple, unrelated merchants. Not needed for a single-owner integration. (If you ever pivot, implement Square OAuth: https://developer.squareup.com/docs/oauth-overview)

> Recommended Path: Option B (controlled team access) OR Option A (secure secret sharing) depending on Owner comfort level. Avoid sharing the Owner’s master login.

---
## PHASE 7: Owner – Set Up Webhook Subscription
Purpose: Update orders if Square sends asynchronous payment status changes.
1. Developer provides the endpoint URL structure: `https://YOUR_DOMAIN/payments/square/webhook`
   - For local dev: use a tunnel (ngrok) and share the generated HTTPS URL.
2. Owner (or Developer with proper permission) in Developer Dashboard → Your App → Webhooks → Subscriptions → “Add Subscription”.
3. API Version: latest default.
4. Notification URL: production domain first (add sandbox later, or vice versa). For sandbox testing with ngrok: `https://<random>.ngrok.io/payments/square/webhook`.
5. Events: Add `payment.updated` (you can add more later: e.g., `payment.created`, `refund.updated`).
6. Save → Copy the **Signature Key**.
7. Provide the Signature Key to the developer (securely) to set `SQUARE_WEBHOOK_SIGNATURE_KEY` in server `.env`.
8. Test: Use “Send Test Event” in Webhooks UI. Expect HTTP 200 from server.

---
## PHASE 8: Developer – Sandbox Testing Checklist
1. Start backend (with sandbox variables).
2. Start frontend (pointing to backend: `VITE_API_SERVER_URL`).
3. Create order + attempt payment using sandbox test cards:
   - Docs: https://developer.squareup.com/docs/devtools/sandbox/payments
   - Example Visa test: `4111 1111 1111 1111`, CVV `111`, future expiry, ZIP `12345`.
4. Confirm:
   - Payment creation returns success JSON.
   - Order status updates to `completed` (either immediate or after webhook).
   - Webhook logs show `payment.updated`.
5. Simulate failure (optional) by forcing invalid sourceId or amount < $0.50 to test error handling.

---
## PHASE 9: Go Live (Production Switch)
Owner supplies Production credentials when confident.
Developer updates server `.env`:
```
SQUARE_ENVIRONMENT=production
SQUARE_ACCESS_TOKEN=EAAA_PRODUCTION_ACCESS_TOKEN
SQUARE_LOCATION_ID=PRODUCTION_LOCATION_ID
SQUARE_WEBHOOK_SIGNATURE_KEY=PRODUCTION_WEBHOOK_SIGNATURE_KEY
```
Also ensure:
- Add production domain(s) to `WHITELISTED_DOMAINS`.
- Frontend `VITE_API_SERVER_URL` now points to production API base (e.g., `https://api.yourdomain.com`).
- New Production webhook subscription created (separate from Sandbox) pointing to live domain.
- Perform a real small-value test charge ($1.00) and refund if needed.

---
## PHASE 10: Security & Governance
| Item | Owner | Developer |
|------|-------|-----------|
| Production Access Token storage | Secure manager | Never commits / not client-side |
| Sandbox token rotation | Optional | Can request new if compromised |
| Webhook Signature Key | Stored in prod secrets | Not exposed outside server |
| Bank changes | Owner only | N/A |
| Team role adjustments | Owner | Request via Owner |

Best Practices:
- Regenerate tokens if leaked (Developer Dashboard → Credentials → Regenerate). Update `.env` immediately.
- Use HTTPS everywhere (cert auto-renew e.g., via Let’s Encrypt).
- Log only partial identifiers (first 6 chars of paymentId).
- Keep server time in sync (webhook signature validation depends on correct time window).

---
## PHASE 11: Troubleshooting Quick Table
| Symptom | Likely Cause | Action |
|---------|--------------|--------|
| Network Error (frontend) | Backend not reachable / wrong URL | Verify server listening & `VITE_API_SERVER_URL` |
| 401 on webhook | Signature mismatch | Re-copy key; ensure raw body middleware precedes JSON parser |
| Payment amount off | Double conversion | Ensure only one dollars→cents multiply (x100) |
| Sandbox works, production fails | Wrong env mix | Confirm both token & location from same environment |
| Developer can’t see app | Missing team permission | Owner adjusts Team role permissions |

---
## PHASE 12: Summary of What Owner Sends to Developer
(Use secure channel – NOT plain email/chat.)
- Sandbox: Access Token, Location ID, Webhook Signature Key (after webhook creation)
- Production: same set ONLY when ready to launch
- Confirmation of production domain(s) + any CORS requirements

Developer NEVER needs:
- Owner master password
- Bank info
- Personally Identifiable verification artifacts

---
## OPTIONAL: OAuth (If Scaling to Multiple Merchants Later)
If you turn this into a multi-merchant platform, migrate to Square OAuth so each merchant installs the app and you store merchant-specific access tokens. Reference: https://developer.squareup.com/docs/oauth-overview

---
## FINAL CHECKLIST (Copy/Paste for Owner)
[ ] Business account created & verified
[ ] Bank account linked
[ ] Application created (Sandbox & Production tabs visible)
[ ] Sandbox Access Token shared securely
[ ] Sandbox Location ID shared
[ ] Webhook (sandbox) subscription created, signature key shared
[ ] Developer verified sandbox payment success
[ ] Production Access Token & Location ID shared (just before launch)
[ ] Production webhook configured
[ ] Live $1 test charge successful
[ ] Documentation stored securely

---
Questions or changes needed? Provide the specific phase + step number when asking for help to accelerate support.
