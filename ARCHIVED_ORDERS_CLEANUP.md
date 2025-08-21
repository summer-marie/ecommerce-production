# Archived Orders Cleanup System

## Overview
Automated system to clean up archived orders older than 30 days to maintain database performance and comply with data retention policies.

## Components

### Backend Components

1. **`scripts/cleanupArchivedOrders.js`**
   - Main cleanup logic
   - Can be run standalone or imported
   - Provides cleanup and preview functions

2. **`orders/orderCleanup.js`**
   - API endpoints for manual cleanup
   - GET `/api/orders/cleanup-preview` - Preview cleanup stats
   - DELETE `/api/orders/cleanup-archived` - Manual cleanup trigger

3. **`scheduledTasks.js`**
   - Cron job scheduler
   - Runs cleanup daily at 2:00 AM
   - Integrated with main server startup

### Frontend Components

1. **Redux Integration**
   - `getCleanupPreview` - Get cleanup statistics
   - `cleanupArchivedOrders` - Trigger manual cleanup
   - State management for cleanup operations

2. **Admin Interface**
   - Cleanup statistics display
   - Manual cleanup controls
   - Retention policy information
   - Real-time status updates

## Usage

### Automatic Cleanup
- Runs daily at 2:00 AM automatically
- Deletes archived orders older than 30 days
- Logs results to console and system logs

### Manual Cleanup
```bash
# Run cleanup script directly
npm run cleanup:orders

# Or via API
curl -X DELETE http://localhost:8000/api/orders/cleanup-archived

# Get preview
curl http://localhost:8000/api/orders/cleanup-preview
```

### Admin Interface
1. Navigate to Admin > Archived Orders
2. View cleanup statistics in the yellow control panel
3. Click "Show Details" for more information
4. Use "Manual Cleanup" button to trigger immediate cleanup

## Configuration

### Retention Period
The 30-day retention period is defined in `scripts/cleanupArchivedOrders.js`:
```javascript
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
```

### Schedule
The cleanup schedule is defined in `scheduledTasks.js`:
```javascript
cron.schedule("0 2 * * *", async () => {
  // Runs daily at 2:00 AM
});
```

## Important Notes

1. **Tax Compliance**: Keep archived orders for at least 1 year before allowing deletion
2. **Data Loss**: Deleted orders cannot be recovered
3. **Database Performance**: Regular cleanup maintains optimal performance
4. **Timezone**: Scheduled task uses America/New_York timezone by default

## Monitoring

- Check server logs for cleanup results
- Admin interface shows real-time statistics
- Manual cleanup provides immediate feedback
- Error handling with detailed logging

## Troubleshooting

1. **Cleanup Not Running**: Check server logs for cron job errors
2. **Database Connection**: Ensure MongoDB connection is stable
3. **Permissions**: Verify API endpoints are accessible
4. **Timezone Issues**: Adjust timezone in `scheduledTasks.js` if needed
