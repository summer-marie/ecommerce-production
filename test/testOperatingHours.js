import "dotenv/config";
import axios from "axios";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:8010";
const API_BASE = `${SERVER_URL}/operating-hours`;

// Test data for weekly hours
const weeklyHoursTestData = {
  timezone: "America/New_York",
  weeklyHours: {
    mon: [{ start: "09:00", end: "17:00" }],
    tue: [{ start: "09:00", end: "17:00" }],
    wed: [{ start: "09:00", end: "17:00" }],
    thu: [{ start: "09:00", end: "17:00" }],
    fri: [{ start: "09:00", end: "17:00" }],
    sat: [{ start: "10:00", end: "16:00" }],
    sun: [] // Closed on Sunday
  },
  bannerMessageOpen: "We're open and ready to serve you!",
  bannerMessageClosed: "We're currently closed. Please visit us during business hours.",
  adminAlertEmails: ["admin@test.com"]
};

// Test data for special windows (monthly/seasonal hours)
const specialWindowsTestData = {
  specialOpenWindows: [
    {
      start: new Date("2025-12-24T10:00:00.000Z").toISOString(),
      end: new Date("2025-12-24T14:00:00.000Z").toISOString(),
      note: "Christmas Eve - Limited Hours"
    },
    {
      start: new Date("2025-01-01T12:00:00.000Z").toISOString(),
      end: new Date("2025-01-01T18:00:00.000Z").toISOString(),
      note: "New Year's Day - Special Hours"
    }
  ]
};

// Get admin JWT token (you'll need to implement this based on your auth system)
async function getAdminToken() {
  try {
    // Replace with your actual admin login endpoint and credentials
    const response = await axios.post(`${SERVER_URL}/auth/login`, {
      email: "centikeenan@gmail.com", 
      password: "Dukeharvey12!" 
    });
    return response.data.token;
  } catch (error) {
    console.error("Failed to get admin token:", error.message);
    console.log("Please ensure you have an admin user created and update the credentials in this test file.");
    return null;
  }
}

// Test functions
async function testGetCurrentStatus() {
  console.log("\n🔍 Testing: Get Current Operating Status (Public)");
  try {
    const response = await axios.get(`${API_BASE}/status`);
    console.log("✅ Current Status:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("❌ Error getting status:", error.response?.data || error.message);
    return null;
  }
}

async function testGetAdminConfig(token) {
  console.log("\n🔍 Testing: Get Admin Configuration");
  if (!token) {
    console.log("⚠️ Skipping admin config test - no token");
    return null;
  }
  
  try {
    const response = await axios.get(API_BASE, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Admin Config:", JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error) {
    console.error("❌ Error getting admin config:", error.response?.data || error.message);
    return null;
  }
}

async function testUpdateWeeklyHours(token) {
  console.log("\n🔍 Testing: Update Weekly Hours");
  if (!token) {
    console.log("⚠️ Skipping weekly hours test - no token");
    return null;
  }

  try {
    const response = await axios.put(API_BASE, weeklyHoursTestData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Weekly Hours Updated:", JSON.stringify(response.data, null, 2));
    
    // Verify the update by getting current status
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    const status = await testGetCurrentStatus();
    return response.data;
  } catch (error) {
    console.error("❌ Error updating weekly hours:", error.response?.data || error.message);
    return null;
  }
}

async function testUpdateSpecialWindows(token) {
  console.log("\n🔍 Testing: Update Special Windows (Monthly/Seasonal Hours)");
  if (!token) {
    console.log("⚠️ Skipping special windows test - no token");
    return null;
  }

  try {
    const response = await axios.put(API_BASE, specialWindowsTestData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Special Windows Updated:", JSON.stringify(response.data, null, 2));
    
    // Verify the update
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    const status = await testGetCurrentStatus();
    return response.data;
  } catch (error) {
    console.error("❌ Error updating special windows:", error.response?.data || error.message);
    return null;
  }
}

async function testCombinedConfiguration(token) {
  console.log("\n🔍 Testing: Combined Weekly + Special Windows Configuration");
  if (!token) {
    console.log("⚠️ Skipping combined test - no token");
    return null;
  }

  const combinedData = {
    ...weeklyHoursTestData,
    ...specialWindowsTestData,
    devForceOpen: false,
    forceClosed: false
  };

  try {
    const response = await axios.put(API_BASE, combinedData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Combined Configuration Updated:", JSON.stringify(response.data, null, 2));
    
    // Verify the update
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    const status = await testGetCurrentStatus();
    return response.data;
  } catch (error) {
    console.error("❌ Error updating combined configuration:", error.response?.data || error.message);
    return null;
  }
}

async function testForceOverrides(token) {
  console.log("\n🔍 Testing: Force Open/Close Overrides");
  if (!token) {
    console.log("⚠️ Skipping override tests - no token");
    return null;
  }

  // Test force open
  console.log("\n  Testing Force Open...");
  try {
    const forceOpenResponse = await axios.put(API_BASE, { devForceOpen: true }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Force Open Set");
    
    const statusAfterForceOpen = await testGetCurrentStatus();
    console.log("  Status after force open:", statusAfterForceOpen?.status?.isOpen ? "OPEN ✅" : "CLOSED ❌");
  } catch (error) {
    console.error("❌ Error setting force open:", error.response?.data || error.message);
  }

  // Test force closed
  console.log("\n  Testing Force Closed...");
  try {
    const forceClosedResponse = await axios.put(API_BASE, { 
      devForceOpen: false,
      forceClosed: true 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Force Closed Set");
    
    const statusAfterForceClosed = await testGetCurrentStatus();
    console.log("  Status after force closed:", statusAfterForceClosed?.status?.isOpen ? "OPEN ❌" : "CLOSED ✅");
  } catch (error) {
    console.error("❌ Error setting force closed:", error.response?.data || error.message);
  }

  // Reset overrides
  console.log("\n  Resetting overrides...");
  try {
    await axios.put(API_BASE, { 
      devForceOpen: false,
      forceClosed: false 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("✅ Overrides Reset");
  } catch (error) {
    console.error("❌ Error resetting overrides:", error.response?.data || error.message);
  }
}

// Main test runner
async function runAllTests() {
  console.log("🚀 Starting Operating Hours Feature Tests");
  console.log("==========================================");

  // Test public endpoint first (no auth required)
  await testGetCurrentStatus();

  // Get admin token for authenticated tests
  const token = await getAdminToken();
  
  if (token) {
    console.log("✅ Admin token obtained successfully");
    
    // Run authenticated tests
    await testGetAdminConfig(token);
    await testUpdateWeeklyHours(token);
    await testUpdateSpecialWindows(token);
    await testCombinedConfiguration(token);
    await testForceOverrides(token);
    
    console.log("\n🎉 All tests completed!");
  } else {
    console.log("\n⚠️ Could not obtain admin token. Only public tests were run.");
    console.log("To run full tests, please:");
    console.log("1. Ensure you have an admin user created");
    console.log("2. Update the credentials in the getAdminToken() function");
    console.log("3. Make sure your server is running");
  }
}

// Individual test functions for running specific tests
async function runWeeklyTest() {
  console.log("🚀 Testing Weekly Hours Only");
  const token = await getAdminToken();
  if (token) {
    await testUpdateWeeklyHours(token);
  }
}

async function runSpecialWindowsTest() {
  console.log("🚀 Testing Special Windows Only");
  const token = await getAdminToken();
  if (token) {
    await testUpdateSpecialWindows(token);
  }
}

async function runStatusTest() {
  console.log("🚀 Testing Status Check Only");
  await testGetCurrentStatus();
}

// Export functions for individual use
export { 
  runAllTests, 
  runWeeklyTest, 
  runSpecialWindowsTest, 
  runStatusTest,
  testGetCurrentStatus,
  testUpdateWeeklyHours,
  testUpdateSpecialWindows 
};

// Run all tests if this file is executed directly
if (process.argv[1] && process.argv[1].endsWith('testOperatingHours.js')) {
  runAllTests().catch(console.error);
}
