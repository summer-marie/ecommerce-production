# GitHub Copilot Instructions

## Project Overview

This is a **full-stack pizza ecommerce platform** built with modern React 19 + Vite frontend, Express 5 + MongoDB backend, and comprehensive testing infrastructure. The architecture follows a **monorepo structure** with separate `/client`, `/server`, and `/test` directories.

## Architecture Essentials

### Frontend (`/client`)
- **React 19** with **Redux Toolkit** for state management using **RTK Query** patterns
- **Vite 6** build system with **Tailwind CSS 4** for styling
- **Redux slices** are organized by domain: `orderSlice`, `authSlice`, `cartSlice`, etc.
- State persistence via **redux-persist** (cart only)
- Admin dashboard is completely separate from customer interface (`/admin` vs `/customer`)

### Backend (`/server`)
- **Express 5** with **ES modules** (not CommonJS)
- **MongoDB + Mongoose** with domain-specific modules: `/orders`, `/auth`, `/payments`, etc.
- **Passport.js** authentication using JWT and Local strategies
- **Square API** integration for payments (production-ready PCI compliance)
- **Pino** structured logging (Winston was removed) - see `LOGGING_CONVENTIONS.md`

### Key Integrations
- **Square API**: Payment processing via `/payments/squareRoutes.js`
- **SendGrid**: Email notifications and alerts
- **Sentry**: Error monitoring and performance tracking
- **MongoDB Atlas**: Production database with connection pooling

## Critical Patterns & Conventions

### Logging (MANDATORY)
```javascript
// Always use structured logging with events
import { getLog } from './utils/logger.js';

// In route handlers
const log = getLog(req, { feature: 'orderCreate' });
log.info({ event: 'order.create.start', itemCount: items.length }, 'Creating order');

// In background tasks
const log = getLog(null, { operationId: 'cleanupTask' });
log.info({ event: 'script.cleanup.start' }, 'Starting cleanup');
```
- **Event naming**: `<domain>.<action>.<detail>` (e.g., `order.create.success`)
- **NO console.log** - use structured Pino logger exclusively
- Follow patterns in `LOGGING_CONVENTIONS.md` and `PRODUCTION_LOGGING.md`

### Security Middleware Stack
```javascript
// Apply in this order (see server/index.js)
app.use(advancedHelmet);           // Security headers
app.use(authRateLimit);            // Rate limiting per endpoint
app.use(mongoSanitizer);           // Input sanitization
app.use(requestContext);           // Request ID injection
```

### Redux Patterns
- **Services**: API calls in separate service files (`orderService.js`)
- **Slices**: Use RTK createSlice with async thunks
- **Persistence**: Only cart state persists across sessions
- **Error handling**: Consistent error state in all slices

### Database Models
- **Mongoose schemas** in domain folders (`/orders/orderSchema.js`)
- **Validation**: Use express-validator middleware, not Mongoose validation
- **Indexes**: Critical for performance on frequently queried fields

## Development Workflows

### Starting Development
```bash
# Backend (port 8010)
cd server && npm run dev

# Frontend (port 3005) 
cd client && npm run dev

# Tests
cd test && npm run test
```

### Environment Setup
- **Server**: Requires `.env` with `JWT_SECRET`, `MONGODB_ATLAS_URL`, `SQUARE_*` keys
- **Client**: Requires `.env` with `VITE_API_SERVER_URL=http://localhost:8010`
- **Test**: Has separate `.env` for test database connections

### Database Seeding
```bash
cd test
npm run admin     # Create admin users
npm run orders    # Seed sample orders
npm run builders  # Seed pizza configurations
```

## Code Quality Standards

### Error Handling
```javascript
// Always include structured error events
try {
  const result = await service.create(data);
  log.info({ event: 'service.create.success', id: result._id }, 'Created successfully');
  return result;
} catch (err) {
  log.error({ event: 'service.create.error', err: err.message }, 'Creation failed');
  throw err;
}
```

### API Response Format
```javascript
// Success responses
res.status(200).json({ success: true, data: result });

// Error responses  
res.status(400).json({ success: false, message: 'Validation failed', errors: [...] });
```

### Component Organization
- **Admin components**: `/client/src/admin/`
- **Customer components**: `/client/src/customer/`
- **Shared components**: `/client/src/components/`
- **Redux logic**: `/client/src/redux/`

## Security Requirements

### Authentication
- **JWT tokens** for API authentication
- **Sessions** for admin dashboard persistence
- **Password hashing** via Argon2 (not bcrypt)
- **Rate limiting** on auth endpoints (see `advancedSecurity.js`)

### Input Validation
- **All inputs** validated via express-validator middleware
- **MongoDB injection** prevented via sanitization
- **XSS protection** via helmet and input cleaning

### API Security
- **API keys** for external service access (`apiKeyAuth.js`)
- **CORS** properly configured for production domains
- **Security headers** via advanced Helmet configuration

## Testing Strategy

### Test Structure
- **Unit tests**: Jest + React Testing Library
- **Integration tests**: Supertest for API endpoints  
- **Data seeding**: Faker.js for realistic test data
- **Mocking**: MongoDB Memory Server for isolated tests

### Critical Test Areas
- **Toggle functionality**: Pizza builder status changes
- **Operating hours**: Business logic validation
- **Order flow**: End-to-end purchase process
- **Admin operations**: CRUD operations and permissions

## Performance Considerations

### Frontend Optimization
- **Code splitting**: Manual chunks in Vite config
- **React virtualization**: For large lists (orders, menu items)
- **Image optimization**: Base64 encoding for small assets
- **Bundle analysis**: Use Vite's built-in tools

### Backend Performance
- **MongoDB indexing**: On frequently queried fields
- **Connection pooling**: Atlas handles automatically
- **Compression**: Gzip enabled for responses
- **Caching**: Session store via MongoDB

## Common Pitfalls to Avoid

1. **Don't use console.log** - always use structured Pino logging
2. **Don't skip validation** - all inputs must be validated
3. **Don't hardcode secrets** - use environment variables
4. **Don't ignore rate limits** - respect Square API limits
5. **Don't modify core middleware** without understanding security implications
6. **Don't bypass authentication** on protected routes
7. **Don't commit sensitive data** - check `.env` files are gitignored

## Deployment & Production

### Environment Configuration
```bash
# Critical production environment variables
NODE_ENV=production
PORT=8010
MONGODB_ATLAS_URL=mongodb+srv://...
JWT_SECRET=your-secure-secret
COOKIE_SECRET=your-cookie-secret
SESSION_SECRET=your-session-secret

# Square payment integration
SQUARE_ENVIRONMENT=production  # or sandbox
SQUARE_ACCESS_TOKEN=EAAAxxxxxxx
SQUARE_LOCATION_ID=xxxxxxx
SQUARE_WEBHOOK_SIGNATURE_KEY=xxxxxxx

# Email services
SENDGRID_API_KEY=SG.xxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourdomain.com
CONTACT_TO_EMAIL=admin@yourdomain.com

# Monitoring & alerts
SENTRY_DSN=https://xxxxxxx@sentry.io/xxxxxxx
SENTRY_RELEASE=your-release-version
SENTRY_TRACES_SAMPLE_RATE=0.05
SENTRY_PROFILES_SAMPLE_RATE=0.0
```

### Platform-Specific Deployment
- **Railway**: Trust proxy enabled (`app.set("trust proxy", 1)`)
- **Build optimization**: Vite production builds with Terser minification
- **Asset handling**: Base64 encoding for images, favicon auto-generation
- **Health checks**: `/health` endpoint for platform monitoring

### Production Scripts
```bash
# Database maintenance
npm run cleanup:orders      # Clean archived orders
npm run purge:tokens       # Remove empty tokens
npm run admin:reset-password  # Reset admin credentials

# Migration utilities  
npm run migrate            # Database migration to Atlas
```

## Advanced Testing Patterns

### Test Structure & Organization
```javascript
// Domain-specific test files
test/
├── pizzaToggleStatus.test.js     # Pizza builder functionality
├── AdminMenu.toggle.test.jsx     # Admin interface components
├── testOperatingHours.js         # Business hours logic
├── builderToggleStatus.redux.test.js  # Redux state management
```

### Data Generation Strategy
```javascript
// Realistic test data with Faker.js
import { createFakeOrder } from './createFakeOrder.js';
import { createFakeBuilder } from './createFakeBuilder.js';

// Generate test data that matches production patterns
const order = createFakeOrder({
  status: 'pending',
  paymentMethod: 'square',
  items: [{ pizzaName: 'Margherita', quantity: 2 }]
});
```

### Database Seeding Workflows
```bash
# Comprehensive test data setup
cd test
npm run admin      # Create admin users
npm run orders     # Generate sample orders with realistic data
npm run builders   # Seed pizza configurations
npm run messages   # Customer service messages
npm run hours      # Test operating hours scenarios
```

### Testing Categories
- **Unit tests**: Component and function isolation with Jest
- **Integration tests**: API endpoints with Supertest
- **Feature tests**: End-to-end business logic (operating hours, pizza builder)
- **Toggle tests**: Status management and state transitions
- **Performance tests**: Load testing for high-traffic scenarios

## Business Logic & Domain Patterns

### Operating Hours Management
```javascript
// Complex business logic with timezone handling
const status = computeOpenStatus(operatingDoc);
// Returns: { isOpen: boolean, reason: string, nextChange: Date }

// Special window handling (holidays, events)
specialWindows: [{
  date: '2025-12-25',
  closed: true,
  reason: 'Christmas Day'
}]
```

### Pizza Builder System
```javascript
// Status toggle pattern used throughout
toggleStatus: async (builderId) => {
  const builder = await BuilderModel.findById(builderId);
  builder.status = builder.status === 'active' ? 'inactive' : 'active';
  await builder.save();
}
```

### Order Processing Pipeline
```javascript
// Multi-step order flow with Square integration
1. Order creation with validation
2. Square payment processing
3. Email receipt generation (SendGrid)
4. Admin notification system
5. Status tracking and updates
6. Automated cleanup scheduling
```

### Email & Notification System
```javascript
// Multi-transport email system
const transport = process.env.SENDGRID_API_KEY ? 'sendgrid' : 'none';
// Handles: order receipts, admin alerts, customer service responses
```

## Advanced Integrations

### Square Payment Processing
- **Sandbox/Production switching** via environment variables
- **Webhook signature validation** for payment confirmations
- **PCI compliance** through Square Web SDK
- **Error handling** with payment retry logic

### MongoDB Atlas Patterns
- **Connection pooling** handled automatically
- **Domain-specific collections** (`orders`, `builders`, `ingredients`)
- **Indexed queries** for performance optimization
- **Automated cleanup** via scheduled tasks

### Monitoring & Observability
```javascript
// Sentry integration with custom release tracking
Sentry.init({
  release: process.env.SENTRY_RELEASE || process.env.GIT_SHA,
  environment: process.env.NODE_ENV
});

// Performance monitoring with request correlation
const log = getLog(req, { feature: 'orderCreate' });
log.info({ event: 'order.create.start', requestId: req.id });
```

### Scheduled Tasks & Automation
```javascript
// Cron-based background tasks
cron.schedule("0 2 * * *", async () => {
  await cleanupArchivedOrders();  // Daily at 2 AM
}, { timezone: "America/New_York" });
```

## Security Implementation Details

### Multi-Layer Rate Limiting
```javascript
// Endpoint-specific rate limiting
authRateLimit    // 20 requests/15min for authentication
adminRateLimit   // 100 requests/5min for admin operations  
orderRateLimit   // 50 requests/15min for order processing
contactRateLimit // 10 requests/hour for contact forms
```

### Input Sanitization Pipeline
```javascript
// Applied in sequence (see server/index.js)
mongoSanitizer   // Prevent NoSQL injection
xssProtection    // XSS filtering
hppProtection    // HTTP Parameter Pollution prevention
```

### Authentication Strategy
- **JWT tokens** for API access with configurable expiration
- **Session storage** via MongoDB for admin dashboard persistence
- **Argon2 hashing** for password security (more secure than bcrypt)
- **Passport strategies** for flexible authentication methods

## Key Files for Context

When modifying functionality, always reference:
- `LOGGING_CONVENTIONS.md` - Logging standards
- `PRODUCTION_LOGGING.md` - Deployment logging setup
- `SQUARE_OWNER_AND_DEVELOPER_SETUP.md` - Payment integration guide
- `server/middleware/README.md` - Middleware documentation  
- `client/src/redux/README.md` - Redux patterns
- `test/README.md` - Testing guidelines
- `server/scheduledTasks.js` - Background job patterns

This codebase prioritizes **security**, **performance**, and **maintainability** - always consider these factors when making changes.