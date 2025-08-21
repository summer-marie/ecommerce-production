import cron from "node-cron";
import { cleanupArchivedOrders } from "./scripts/cleanupArchivedOrders.js";

/**
 * Scheduled tasks for the ecommerce application
 * This file handles all automated background tasks including database cleanup
 */

/**
 * Schedule archived orders cleanup
 * Runs daily at 2:00 AM to cleanup archived orders older than 30 days
 * This helps maintain database performance and comply with data retention policies
 */
const scheduleArchivedOrdersCleanup = () => {
  // Run daily at 2:00 AM (when site traffic is typically lowest)
  cron.schedule("0 2 * * *", async () => {
    console.log("🕐 Starting scheduled archived orders cleanup at", new Date().toLocaleString());
    
    try {
      const result = await cleanupArchivedOrders();
      
      if (result.success && result.deletedCount > 0) {
        console.log(`✅ Scheduled cleanup completed: ${result.deletedCount} orders deleted`);
      } else if (result.success && result.deletedCount === 0) {
        console.log("ℹ️  Scheduled cleanup completed: No orders to delete");
      } else {
        console.error("❌ Scheduled cleanup failed:", result.error);
      }
    } catch (error) {
      console.error("❌ Error in scheduled cleanup:", error);
    }
  }, {
    scheduled: true,
    timezone: "America/New_York" // Adjust timezone as needed
  });

  console.log("📅 Archived orders cleanup scheduled to run daily at 2:00 AM");
};

/**
 * Initialize all scheduled tasks
 * Call this function from your main server file to start all cron jobs
 */
const initializeScheduledTasks = () => {
  console.log("🚀 Initializing scheduled tasks...");
  
  scheduleArchivedOrdersCleanup();
  
  // Add other scheduled tasks here in the future
  // Example:
  // scheduleBackups();
  // scheduleReports();
  
  console.log("✅ All scheduled tasks initialized");
};

export { initializeScheduledTasks, scheduleArchivedOrdersCleanup };
