import "dotenv/config";
import axios from "axios";
import { generateFakeUsers } from "./createFakeAdmin.js";

// Use admin API key for secure user creation
const ADMIN_API_KEY = "admin_me0iunyf_f5c86d23df38caf36001d63a5a3ec0a9"; // Current admin key

const seedAdmin = generateFakeUsers(1);
console.log("Creating admin user:", seedAdmin);

seedAdmin.forEach(async (user) => {
  try {
    const addUser = await axios.post(`${process.env.SERVER_URL}/admins`, user, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": ADMIN_API_KEY,
      },
    });
    console.log("✅ Admin user created successfully:", addUser.data);
    console.log("📧 Login Email:", user.email);
    console.log("🔑 Login Password: test");
  } catch (error) {
    console.error("❌ Failed to create admin:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Data:", error.response?.data);
    console.error("Message:", error.message);
    console.error("Full Error:", error);
  }
});

// npm run admin
