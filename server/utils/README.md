# Utils Documentation

This directory contains utility services and helper functions that provide core functionality across the application, including email services, cleanup operations, and automated alerts.

## 📧 Utility Services Overview

| File | Purpose | Type |
|------|---------|------|
| `sendEmail.js` | Core email sending functionality with SendGrid | Email Service |
| `emailRetry.js` | Email delivery retry logic and failure handling | Email Service |
| `orderAlertService.js` | Admin notifications for new orders | Alert System |
| `receiptService.js` | Order confirmation and receipt generation | Email Service |
| `messageCleanup.js` | Automated cleanup of old messages | Maintenance |
| `messageScheduler.js` | Scheduled message processing tasks | Automation |

## 🔧 Service Functions

### Email Services
**Core Email Infrastructure:**
- **SendGrid Integration**: Professional email delivery
- **Template Management**: HTML email templates
- **Delivery Tracking**: Success/failure monitoring
- **Retry Logic**: Automatic retry for failed deliveries
- **Error Handling**: Comprehensive error logging

**Specialized Email Types:**
- **Order Receipts**: Customer order confirmations
- **Admin Alerts**: Real-time order notifications
- **System Notifications**: Automated system messages

### Alert Systems
**Order Alert Service:**
- **Real-time Notifications**: Instant admin alerts for new orders
- **Multi-recipient Support**: Configurable admin notification list
- **Delivery Confirmation**: Tracking of alert delivery status
- **Fallback Mechanisms**: Backup notification methods

### Cleanup & Maintenance
**Automated Maintenance:**
- **Message Cleanup**: Removes old customer messages
- **Data Archival**: Automated data lifecycle management
- **Performance Optimization**: Cleanup of temporary data
- **Storage Management**: Prevents database bloat

### Scheduling Services
**Background Tasks:**
- **Scheduled Cleanup**: Automated maintenance windows
- **Periodic Reports**: Automated reporting tasks  
- **System Health Checks**: Regular system validation
- **Data Synchronization**: Automated data consistency checks

## 📋 Usage Examples

### Sending Order Receipts
```javascript
import { sendOrderReceipt } from './receiptService.js';

await sendOrderReceipt({
  customerEmail: 'customer@email.com',
  orderDetails: orderData,
  orderNumber: '#12345'
});
```

### Admin Order Alerts
```javascript
import { sendOrderAlert } from './orderAlertService.js';

await sendOrderAlert(newOrder);
// Automatically sends to all configured admin emails
```

### Email with Retry Logic
```javascript
import { sendEmailWithRetry } from './emailRetry.js';

await sendEmailWithRetry({
  to: 'user@email.com',
  subject: 'Important Message',
  html: templateHTML,
  maxRetries: 3
});
```

## ⚙️ Configuration

### Environment Variables
```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key
FROM_EMAIL=noreply@yourstore.com

# Alert Configuration  
ADMIN_ALERT_ENABLED=true
ADMIN_ALERT_EMAILS=admin1@store.com,admin2@store.com

# Cleanup Configuration
MESSAGE_RETENTION_DAYS=30
CLEANUP_SCHEDULE_CRON="0 2 * * *"
```

### Service Configuration
- **Email Templates**: Customizable HTML templates
- **Retry Policies**: Configurable retry intervals and limits
- **Cleanup Schedules**: Automated maintenance timing
- **Alert Recipients**: Dynamic admin notification lists

## 🔍 Monitoring & Logging

### Email Delivery Tracking
- Success/failure rates
- Delivery time monitoring  
- Bounce and spam reporting
- Template performance analytics

### System Health Monitoring
- Service availability checks
- Performance metrics
- Error rate tracking
- Resource usage monitoring

### Automated Reporting
- Daily cleanup summaries
- Email delivery reports
- System performance reports
- Alert delivery confirmations

## 🛠️ Maintenance

### Regular Tasks
- Monitor email delivery rates
- Review cleanup effectiveness  
- Update email templates
- Optimize retry policies

### Troubleshooting
- Check SendGrid API status
- Verify environment variables
- Review error logs
- Test email deliverability

For detailed API documentation and configuration options, see individual utility files.
