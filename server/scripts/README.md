# Scripts Documentation

This directory contains administrative and maintenance scripts for database management, system cleanup, and administrative tasks.

## 🛠️ Administrative Scripts Overview

| Script | Purpose | Usage Frequency |
|--------|---------|-----------------|
| `cleanupArchivedOrders.js` | Remove old archived orders from database | Weekly/Monthly |
| `fix-delivered-orders.js` | Data correction script for order status issues | As needed |
| `listAdmins.js` | Display all admin users in the system | As needed |
| `purgeEmptyTokens.js` | Clean up expired/empty authentication tokens | Daily/Weekly |
| `resetAdminPassword.js` | Reset admin user passwords | As needed |

## 🔧 Script Categories

### Database Maintenance Scripts
**Data Cleanup:**
- **Archived Orders**: Removes old completed orders to prevent database bloat
- **Token Cleanup**: Purges expired JWT tokens and empty token arrays
- **Order Status Fixes**: Corrects inconsistent order status data

**Performance Optimization:**
- **Database Indexing**: Maintains optimal database performance
- **Storage Cleanup**: Removes unnecessary data and temporary files
- **Query Optimization**: Database performance maintenance

### Administrative Tools
**User Management:**
- **Admin Listing**: View all administrative users
- **Password Reset**: Secure admin password reset functionality
- **Account Maintenance**: Admin account cleanup and validation

**System Administration:**
- **Data Migration**: Database schema updates and data migrations
- **Configuration Updates**: System configuration maintenance
- **Audit Trail Management**: Administrative action logging

## 📋 Usage Instructions

### Running Scripts

**Navigate to server directory:**
```bash
cd server
```

**Execute individual scripts:**
```bash
# Clean up archived orders (older than specified days)
node scripts/cleanupArchivedOrders.js

# Fix order status inconsistencies  
node scripts/fix-delivered-orders.js

# List all admin users
node scripts/listAdmins.js

# Remove expired tokens
node scripts/purgeEmptyTokens.js

# Reset admin password (interactive)
node scripts/resetAdminPassword.js
```

### Automated Execution
Some scripts can be run automatically via cron jobs or scheduled tasks:

```bash
# Daily token cleanup (2 AM)
0 2 * * * cd /path/to/server && node scripts/purgeEmptyTokens.js

# Weekly order cleanup (Sunday 3 AM)  
0 3 * * 0 cd /path/to/server && node scripts/cleanupArchivedOrders.js
```

## ⚙️ Configuration

### Environment Variables
```env
# Database connection for scripts
MONGODB_ATLAS_URL=your_mongodb_connection_string

# Cleanup configuration
ARCHIVE_RETENTION_DAYS=90
TOKEN_CLEANUP_ENABLED=true

# Admin management
ADMIN_PASSWORD_MIN_LENGTH=8
REQUIRE_PASSWORD_COMPLEXITY=true
```

### Script Parameters
Most scripts accept command-line parameters:

```bash
# Cleanup orders older than 60 days
node scripts/cleanupArchivedOrders.js --days=60

# Reset specific admin password
node scripts/resetAdminPassword.js --email=admin@store.com

# List admins with detailed info
node scripts/listAdmins.js --detailed
```

## 🔍 Script Details

### cleanupArchivedOrders.js
- **Purpose**: Remove completed orders older than specified retention period
- **Safety**: Includes confirmation prompts for data deletion
- **Logging**: Comprehensive logging of cleanup operations
- **Backup**: Optionally creates backup before deletion

### fix-delivered-orders.js  
- **Purpose**: Corrects order status inconsistencies in database
- **Validation**: Checks data integrity before making changes
- **Rollback**: Includes rollback functionality for safety
- **Reporting**: Generates detailed fix operation reports

### listAdmins.js
- **Purpose**: Display admin user information and statistics
- **Filtering**: Options to filter by status, role, or date
- **Export**: Can export admin list to CSV/JSON
- **Security**: Masks sensitive information in output

### purgeEmptyTokens.js
- **Purpose**: Clean up authentication tokens and expired sessions
- **Safety**: Validates active sessions before cleanup  
- **Performance**: Optimizes token storage and lookup performance
- **Monitoring**: Reports cleanup statistics and performance gains

### resetAdminPassword.js
- **Purpose**: Secure admin password reset functionality
- **Security**: Includes identity verification steps
- **Validation**: Enforces password complexity requirements  
- **Audit**: Logs all password reset operations

## ⚠️ Safety Considerations

### Pre-execution Checklist
- [ ] **Database Backup**: Always backup before running maintenance scripts
- [ ] **Test Environment**: Test scripts on development/staging first
- [ ] **Active Users**: Check for active admin sessions before user management
- [ ] **Peak Hours**: Avoid running intensive scripts during peak usage

### Error Handling
- All scripts include comprehensive error handling
- Failed operations are logged with detailed error information
- Scripts can be safely interrupted and resumed
- Rollback functionality available for destructive operations

### Monitoring & Logging
- **Execution Logs**: All script executions are logged
- **Performance Metrics**: Execution time and resource usage tracking
- **Error Reporting**: Failed operations trigger admin alerts
- **Success Confirmation**: Completion notifications for critical operations

## 🔧 Troubleshooting

### Common Issues
| Issue | Solution |
|-------|----------|
| Database connection errors | Verify MONGODB_ATLAS_URL and network connectivity |
| Permission denied | Check file permissions and execution rights |
| Script hangs/timeouts | Check database load and connection stability |
| Data validation errors | Review data integrity and schema consistency |

### Debug Mode
Run scripts with debug flag for detailed output:
```bash
DEBUG=true node scripts/scriptName.js
```

### Log Analysis
Check script execution logs:
```bash
tail -f logs/combined.log | grep "SCRIPT"
```

For detailed implementation and advanced configuration options, see individual script files.
