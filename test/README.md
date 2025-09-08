# Test Folder Documentation

This folder contains scripts and resources for testing, seeding, and validating the Ecommerce Site application's functionality.

## Purpose

- **Database Seeding**: Populate the database with initial or sample data for development and testing
- **Feature Testing**: Validate specific application features like operating hours management
- **Data Generation**: Create realistic fake data for comprehensive testing scenarios
- **API Validation**: Test API endpoints and functionality

## Directory Structure

```plaintext
test/
├── README.md                    # This documentation file
├── package.json                 # Dependencies and npm scripts
├── .env                        # Environment variables for testing
│
├── Data Generation Files:
├── createFakeAdmin.js          # Generate fake admin user data
├── createFakeBuilder.js        # Generate fake pizza builder data  
├── createFakeMsgs.js          # Generate fake customer messages
├── createFakeOrder.js         # Generate fake order data
│
├── Database Seeding Scripts:
├── seedAdmin.js               # Seed admin users into database
├── seedBuilder.js             # Seed pizza builder data
├── seedMsgs.js               # Seed customer messages
├── seedOrders.js             # Seed orders
├── users.js                  # Create and register fake users
│
├── Feature Testing:
├── testOperatingHours.js     # Comprehensive operating hours feature tests
├── runHoursTests.js         # Helper script for running specific hour tests
└── OPERATING_HOURS_TESTS.md # Detailed operating hours testing documentation
```

## Prerequisites

- [ ] Node.js (v16 or higher)
- [ ] MongoDB running and accessible
- [ ] Server running on port 8010 (or configured port)
- [ ] All environment variables set in the main server `.env` file

## Dependencies

This test folder uses the following npm packages:
- `axios` - HTTP client for API testing
- `@faker-js/faker` - Generate realistic fake data
- `dotenv` - Environment variable management

Install dependencies:
```bash
cd test
npm install
```

## .env File

The `.env` file in the test directory should contain:

```env
SERVER_URL=http://localhost:8010
```

> Make sure this matches your server's configuration and port.

## Usage

### 📂 **Database Seeding Scripts**

Navigate to the test folder and run individual scripts or use npm scripts:

```bash
cd test
```

**Individual Files:**
```bash
node seedAdmin.js      # Create admin users
node seedBuilder.js    # Create pizza builder data
node seedMsgs.js      # Create customer messages  
node seedOrders.js    # Create sample orders
node users.js         # Create and register users via API
```

**NPM Scripts (Recommended):**
```bash
npm run admin         # Seed admin users
npm run builders      # Seed pizza builders
npm run messages      # Seed customer messages
npm run orders        # Seed orders
npm run user          # Create users via API
```

### 🧪 **Feature Testing**

**Operating Hours Tests:**
```bash
# Run all operating hours tests
npm run hours

# Run specific tests
npm run hours:weekly    # Test weekly schedule configuration
npm run hours:special   # Test special windows (holidays/events)
npm run hours:status    # Test public status endpoint (no auth)

# Or use the helper script
node runHoursTests.js all
node runHoursTests.js weekly
node runHoursTests.js special
node runHoursTests.js status
```

### 🎭 **Data Generation Functions**

The `createFake*.js` files contain utility functions for generating realistic test data:

- **`createFakeAdmin.js`**: Generates admin user objects with faker.js
- **`createFakeBuilder.js`**: Creates pizza builder configurations
- **`createFakeMsgs.js`**: Generates customer service messages
- **`createFakeOrder.js`**: Creates realistic order data

These are used by the seeding scripts and can be imported for custom testing needs.

## 📋 **File Details**

### Database Seeding Scripts

| File | Purpose | Function |
|------|---------|----------|
| `seedAdmin.js` | Creates admin users | Uses `createFakeAdmin.js` to generate and POST admin users to `/users` endpoint |
| `seedBuilder.js` | Pizza builder data | Seeds pizza configurations and builder options |
| `seedMsgs.js` | Customer messages | Creates sample customer service messages |
| `seedOrders.js` | Order data | Generates sample orders with various statuses |
| `users.js` | User registration | Creates fake users and registers them via API |

### Data Generation Utilities

| File | Purpose | Exports |
|------|---------|---------|
| `createFakeAdmin.js` | Admin user generator | `generateFakeUsers(count)` - Creates array of admin user objects |
| `createFakeBuilder.js` | Pizza builder generator | Functions for creating pizza configurations |
| `createFakeMsgs.js` | Message generator | Creates realistic customer service messages |
| `createFakeOrder.js` | Order generator | Generates complete order objects with items and details |

### Feature Testing

| File | Purpose | Key Functions |
|------|---------|---------------|
| `testOperatingHours.js` | Operating hours testing | `runAllTests()`, `testGetCurrentStatus()`, `testUpdateWeeklyHours()`, `testUpdateSpecialWindows()` |
| `runHoursTests.js` | Test runner helper | Command-line interface for running specific operating hours tests |

### Configuration

| File | Purpose | Contents |
|------|---------|----------|
| `package.json` | Dependencies & scripts | npm scripts for all test operations |
| `.env` | Environment config | `SERVER_URL` and other test-specific variables |
| `OPERATING_HOURS_TESTS.md` | Documentation | Detailed guide for operating hours feature testing |

## ⚙️ **Advanced Usage**

### Custom Test Data Generation

You can import the fake data generators in your own scripts:

```javascript
import { generateFakeUsers } from './createFakeAdmin.js';
import { generateFakeOrders } from './createFakeOrder.js';

// Generate 5 admin users
const admins = generateFakeUsers(5);

// Generate 10 fake orders
const orders = generateFakeOrders(10);
```

### Operating Hours Test Configuration

Before running operating hours tests, update the admin credentials in `testOperatingHours.js`:

```javascript
// In getAdminToken() function
const response = await axios.post(`${SERVER_URL}/auth/login`, {
  email: "your-admin@email.com",     // Replace with real admin email
  password: "your-admin-password"    // Replace with real admin password
});
```

## 🔧 **Testing Features**

### What Gets Tested

**Operating Hours Feature:**
- ✅ Weekly schedule configuration (Mon-Sun with time windows)
- ✅ Special windows/overrides (holidays, events, seasonal hours)
- ✅ Force open/close controls for admins
- ✅ Public status checking (no authentication required)
- ✅ Admin configuration management
- ✅ Timezone handling and date calculations
- ✅ Real-time open/closed status determination

### Expected Test Results

**Successful Operating Hours Test Output:**
```
🚀 Starting Operating Hours Feature Tests
✅ Current Status: { "isOpen": true, "reason": "weeklyWindow" }
✅ Admin token obtained successfully
✅ Weekly Hours Updated
✅ Special Windows Updated
✅ Combined Configuration Updated
✅ Force Open/Close Tested
🎉 All tests completed!
```

## 📚 **Documentation**

- **`README.md`** - This comprehensive guide
- **`OPERATING_HOURS_TESTS.md`** - Detailed operating hours testing documentation with troubleshooting

## ⚠️ **Important Notes**

### Development vs Production
- **Development**: These scripts are perfect for local development and testing
- **Production**: DO NOT run seeding scripts on production databases
- **Testing**: Always verify your server is running before executing tests

### Data Management
- Seeding scripts may create duplicate data if run multiple times
- Consider clearing collections before seeding for clean test data
- Operating hours tests modify the actual operating configuration

### Authentication
- Most tests require valid admin credentials
- Update authentication details in test files before running
- Some endpoints (like status checking) work without authentication

## 🐛 **Troubleshooting**

### Common Issues

| Issue | Solution |
|-------|----------|
| Connection errors | Check MongoDB URI and server status |
| 401 Unauthorized | Update admin credentials in test files |
| 404 Not Found | Verify server is running on correct port (8010) |
| Module import errors | Run `npm install` to install dependencies |
| Route not found | Check server routes are properly registered |

### Debug Steps
1. Verify server is running: Check `http://localhost:8010`
2. Check environment variables in `.env` file
3. Ensure database connection is working
4. Validate admin user exists for authenticated tests
5. Check server logs for detailed error information