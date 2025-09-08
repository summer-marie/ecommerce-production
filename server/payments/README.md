# Payments Documentation

This directory contains the Square payment integration system, handling secure payment processing, transaction management, and payment-related functionality.

## 💳 Payment System Overview

| File | Purpose | Responsibility |
|------|---------|---------------|
| `squareController.js` | Payment processing logic and business rules | Transaction handling, validation, error management |
| `squareRoutes.js` | Payment API endpoints and routing | Request/response handling, middleware integration |

## 🔧 Payment Features

### Core Payment Processing
- **Secure Transactions**: PCI-compliant payment processing via Square API
- **Multiple Payment Methods**: Credit/debit cards, digital wallets  
- **Real-time Processing**: Immediate payment authorization and capture
- **Transaction Validation**: Comprehensive payment validation and verification

### Order Integration
- **Order Linking**: Automatic payment-to-order association
- **Status Synchronization**: Real-time order status updates based on payment
- **Refund Management**: Automated refund processing for cancelled orders
- **Receipt Generation**: Automatic receipt creation and delivery

### Security & Compliance
- **PCI Compliance**: Secure payment data handling
- **Tokenization**: Secure card data tokenization via Square
- **Fraud Protection**: Built-in fraud detection and prevention
- **Data Encryption**: End-to-end payment data encryption

## 📋 API Endpoints

### Payment Processing
```
POST /payments/process
```
- **Purpose**: Process a new payment transaction
- **Authentication**: Required (customer session)
- **Payload**: Payment details, order information, customer data
- **Response**: Payment confirmation, transaction ID, receipt data

### Payment Validation
```
POST /payments/validate
```
- **Purpose**: Pre-validate payment information before processing
- **Authentication**: Required (customer session)  
- **Payload**: Payment method details, amount validation
- **Response**: Validation status, estimated fees, processing time

### Transaction Status
```
GET /payments/status/:transactionId
```
- **Purpose**: Check payment transaction status
- **Authentication**: Required (customer or admin)
- **Parameters**: Transaction ID from initial payment
- **Response**: Transaction status, payment details, order status

### Refund Processing
```
POST /payments/refund/:transactionId
```
- **Purpose**: Process refund for completed transaction
- **Authentication**: Required (admin only)
- **Parameters**: Transaction ID, refund amount (optional)
- **Response**: Refund confirmation, updated transaction status

## ⚙️ Configuration

### Environment Variables
```env
# Square API Configuration
SQUARE_APPLICATION_ID=your_square_app_id
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_ENVIRONMENT=sandbox  # or 'production'
SQUARE_LOCATION_ID=your_location_id

# Payment Processing Settings
PAYMENT_TIMEOUT_MS=30000
MAX_PAYMENT_AMOUNT=50000  # in cents
MIN_PAYMENT_AMOUNT=100    # in cents

# Security Settings
ENABLE_FRAUD_DETECTION=true
REQUIRE_CVV_VALIDATION=true
PAYMENT_ENCRYPTION_KEY=your_encryption_key
```

### Square Setup Requirements
- **Square Developer Account**: Active Square developer account
- **Application Registration**: Registered application in Square Dashboard  
- **API Credentials**: Valid access tokens and application IDs
- **Webhook Configuration**: Payment event webhook endpoints
- **Location Setup**: Configured Square business location

## 🔍 Payment Flow

### Standard Payment Process
1. **Payment Initiation**: Customer submits payment form
2. **Pre-validation**: Validate payment method and amount
3. **Square Token Creation**: Generate secure payment token via Square API
4. **Transaction Processing**: Submit payment to Square for authorization
5. **Order Update**: Update order status based on payment result
6. **Receipt Generation**: Generate and send payment receipt
7. **Confirmation**: Return payment confirmation to customer

### Error Handling Flow
1. **Payment Failure**: Capture and categorize payment errors
2. **Error Classification**: Determine error type (card declined, network, etc.)
3. **Customer Notification**: Provide clear error message to customer
4. **Retry Logic**: Allow payment retry with different method if applicable
5. **Order Management**: Update order status appropriately
6. **Admin Notification**: Alert admins to payment processing issues

## 📊 Transaction Management

### Payment States
- **Pending**: Payment initiated but not yet processed
- **Authorized**: Payment authorized but not captured
- **Completed**: Payment successfully captured
- **Failed**: Payment processing failed
- **Refunded**: Payment refunded (partial or full)
- **Cancelled**: Payment cancelled before processing

### Transaction Logging
- **Payment Attempts**: Log all payment processing attempts
- **Error Tracking**: Comprehensive error logging and categorization
- **Audit Trail**: Complete audit trail for compliance and troubleshooting
- **Performance Metrics**: Payment processing time and success rate monitoring

## 🛡️ Security Measures

### Data Protection
- **No Card Storage**: Never store card numbers or sensitive payment data
- **Token-based Processing**: Use Square tokens for all transactions
- **Encrypted Communication**: All API communications use HTTPS/TLS
- **PCI Compliance**: Adhere to PCI DSS requirements

### Fraud Prevention
- **Built-in Fraud Detection**: Leverage Square's fraud detection
- **Transaction Limits**: Configurable minimum/maximum transaction amounts
- **Rate Limiting**: Prevent payment processing abuse
- **IP Validation**: Optional IP-based fraud prevention

### Access Control
- **Customer Authentication**: Require valid customer session for payments
- **Admin Authorization**: Admin-only access for refunds and transaction management
- **API Key Protection**: Secure API key management and rotation
- **Webhook Validation**: Verify Square webhook authenticity

## 🔧 Testing & Development

### Test Mode Configuration
```env
SQUARE_ENVIRONMENT=sandbox
SQUARE_ACCESS_TOKEN=your_sandbox_token
```

### Test Card Numbers
Square provides test card numbers for development:
- **Visa**: 4111 1111 1111 1111
- **Mastercard**: 5105 1051 0510 5100  
- **American Express**: 3782 8224 6310 005

### Testing Scenarios
- **Successful Payments**: Test complete payment flows
- **Card Declines**: Test various decline scenarios
- **Network Errors**: Test payment system resilience
- **Refund Processing**: Test refund workflows

## 🚨 Troubleshooting

### Common Issues
| Issue | Cause | Solution |
|-------|-------|----------|
| Payment timeouts | Network latency or Square API issues | Implement retry logic, check API status |
| Card declined | Insufficient funds, invalid card | Provide clear error messages, allow retry |
| API authentication errors | Invalid tokens or expired credentials | Verify API keys, refresh tokens |
| Webhook failures | Invalid webhook URLs or signatures | Check webhook configuration, validate signatures |

### Debugging Tools
- **Square Dashboard**: Monitor transactions in Square seller dashboard
- **API Logs**: Review payment API request/response logs
- **Error Reports**: Analyze payment error patterns and frequencies
- **Performance Monitoring**: Track payment processing performance

### Support Resources
- **Square Documentation**: Comprehensive API documentation
- **Developer Forums**: Square developer community support
- **Technical Support**: Square technical support for integration issues
- **Status Page**: Square API status and maintenance notifications

For detailed API documentation and integration examples, see individual payment files and Square's official documentation.
