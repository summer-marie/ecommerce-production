# Operating Hours Feature Tests

This directory contains comprehensive tests for the admin hours of operation feature, including both weekly schedule configuration and special windows (monthly/seasonal hours).

## Test Files

- `testOperatingHours.js` - Main test suite with all test functions
- `runHoursTests.js` - Helper script for running specific tests

## Features Tested

### 1. Weekly Hours Configuration
- Setting regular business hours for each day of the week
- Multiple time windows per day support
- Timezone handling
- Days with no hours (closed days)

### 2. Special Windows (Monthly/Seasonal Hours)
- Holiday hours override
- Special event hours
- Seasonal schedule changes
- Date-specific operating windows

### 3. Override Controls
- Developer force open (bypass all schedules)
- Admin force closed (override all schedules)
- Admin alert email configuration

### 4. Status Checking
- Public status endpoint (no auth required)
- Real-time open/closed determination
- Reason codes for status decisions

## How to Run Tests

### Prerequisites

1. Make sure your server is running on the configured port
2. Ensure you have an admin user created
3. Update the admin credentials in `testOperatingHours.js` in the `getAdminToken()` function
4. Install dependencies: `npm install`

### Running All Tests

```bash
# Run the complete test suite
npm run hours

# Or use the helper script
node runHoursTests.js all
```

### Running Individual Tests

```bash
# Test weekly hours only
npm run hours:weekly
# Or: node runHoursTests.js weekly

# Test special windows only
npm run hours:special  
# Or: node runHoursTests.js special

# Test status check only (no auth required)
npm run hours:status
# Or: node runHoursTests.js status
```

## Test Configuration

### Default Test Data

**Weekly Hours:**
- Monday-Friday: 9:00 AM - 5:00 PM
- Saturday: 10:00 AM - 4:00 PM  
- Sunday: Closed
- Timezone: America/New_York

**Special Windows:**
- Christmas Eve: 10:00 AM - 2:00 PM UTC
- New Year's Day: 12:00 PM - 6:00 PM UTC

### Customizing Test Data

You can modify the test data in `testOperatingHours.js`:

```javascript
const weeklyHoursTestData = {
  timezone: "America/New_York",
  weeklyHours: {
    mon: [{ start: "09:00", end: "17:00" }],
    // ... customize as needed
  }
};

const specialWindowsTestData = {
  specialOpenWindows: [
    {
      start: new Date("2025-12-24T10:00:00.000Z").toISOString(),
      end: new Date("2025-12-24T14:00:00.000Z").toISOString(),
      note: "Christmas Eve - Limited Hours"
    }
    // ... add more special windows
  ]
};
```

## Expected Test Output

### Successful Test Run
```
🚀 Starting Operating Hours Feature Tests
==========================================

🔍 Testing: Get Current Operating Status (Public)
✅ Current Status: {
  "success": true,
  "status": {
    "isOpen": false,
    "reason": "outsideHours",
    "timezone": "America/New_York",
    // ...
  }
}

✅ Admin token obtained successfully

🔍 Testing: Get Admin Configuration
✅ Admin Config: { ... }

🔍 Testing: Update Weekly Hours
✅ Weekly Hours Updated: { ... }

🔍 Testing: Update Special Windows (Monthly/Seasonal Hours)
✅ Special Windows Updated: { ... }

// ... more tests

🎉 All tests completed!
```

## Troubleshooting

### Common Issues

1. **"Could not obtain admin token"**
   - Update admin credentials in `getAdminToken()` function
   - Ensure admin user exists in database
   - Check server is running and accessible

2. **"Unauthorized" errors**
   - Verify admin JWT token is valid
   - Check admin authentication endpoint
   - Ensure admin has proper permissions

3. **Connection errors**
   - Verify `SERVER_URL` in `.env` file
   - Check server is running on expected port
   - Ensure database connection is working

### Environment Variables

Make sure these are set in your `.env` file:
```
SERVER_URL=http://localhost:5000
# Add any other required environment variables
```

## API Endpoints Tested

- `GET /api/operating-hours/status` - Public status check
- `GET /api/operating-hours` - Admin configuration (requires auth)
- `PUT /api/operating-hours` - Update configuration (requires auth)

## Test Coverage

✅ Weekly schedule configuration  
✅ Special windows/overrides  
✅ Combined weekly + special configuration  
✅ Force open/close overrides  
✅ Public status checking  
✅ Admin configuration management  
✅ Timezone handling  
✅ Error handling and validation
