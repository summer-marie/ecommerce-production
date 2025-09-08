# Middleware Documentation

This directory contains all middleware components that handle cross-cutting concerns like security, validation, performance monitoring, and access control.

## 🛡️ Middleware Overview

| File | Purpose | Applied To |
|------|---------|------------|
| `advancedSecurity.js` | Advanced security headers, rate limiting, attack prevention | Global/Selective routes |
| `apiKeyAuth.js` | API key authentication for external integrations | API endpoints |
| `logger.js` | Request/response logging with Winston | All requests |
| `operatingHoursGuard.js` | Business hours enforcement | Order-related endpoints |
| `performance.js` | Performance monitoring and optimization | Global |
| `security.js` | Basic security headers and CORS | Global |
| `validation.js` | Request data validation and sanitization | Form submissions |

## 🔧 Middleware Functions

### Security Middleware
- **CORS Protection**: Configurable cross-origin resource sharing
- **Rate Limiting**: Prevent abuse and DoS attacks  
- **Security Headers**: HSTS, CSP, X-Frame-Options protection
- **Input Sanitization**: XSS and injection attack prevention

### Authentication & Authorization
- **JWT Validation**: Token-based authentication
- **API Key Management**: External service authentication
- **Role-based Access**: Admin vs customer permissions
- **Session Management**: Secure session handling

### Performance & Monitoring  
- **Request Logging**: Comprehensive audit trails
- **Performance Metrics**: Response time monitoring
- **Error Tracking**: Centralized error handling
- **Health Checks**: System status monitoring

### Business Logic Enforcement
- **Operating Hours**: Automatic order blocking during closed hours
- **Validation Rules**: Data integrity enforcement
- **Custom Guards**: Business-specific access controls

## 📋 Usage Patterns

### Global Middleware (Applied to all routes)
```javascript
app.use(security);
app.use(logger);
app.use(performance);
```

### Route-Specific Middleware
```javascript
app.use("/orders", operatingHoursGuard);
app.use("/api/*", apiKeyAuth);
```

### Conditional Middleware
```javascript
// Applied only during business hours
if (isBusinessHours()) {
  app.use(fastProcessing);
}
```

## ⚙️ Configuration

Most middleware can be configured through environment variables:
- Rate limiting thresholds
- CORS domains
- Security policy settings
- Logging levels
- Performance monitoring intervals

## 🔍 Monitoring

All middleware includes comprehensive logging and can be monitored through:
- Application logs (`logs/combined.log`)
- Error tracking (`logs/error.log`) 
- Performance metrics endpoint
- Health check endpoints

For detailed implementation and configuration options, see individual middleware files.
