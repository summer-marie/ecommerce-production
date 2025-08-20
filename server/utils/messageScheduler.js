import { cleanupOldMessages } from "../utils/messageCleanup.js";

// Schedule daily cleanup at 2 AM
const scheduleMessageCleanup = () => {
  const runCleanup = async () => {
    console.log("🕐 Running scheduled message cleanup...");
    const deletedCount = await cleanupOldMessages();
    
    if (deletedCount > 0) {
      console.log(`✅ Daily cleanup completed: ${deletedCount} old messages removed`);
    } else {
      console.log("✅ Daily cleanup completed: No old messages to remove");
    }
  };

  // Calculate milliseconds until next 2 AM
  const now = new Date();
  const next2AM = new Date();
  next2AM.setHours(2, 0, 0, 0);
  
  // If it's already past 2 AM today, schedule for tomorrow
  if (now.getHours() >= 2) {
    next2AM.setDate(next2AM.getDate() + 1);
  }
  
  const msUntil2AM = next2AM.getTime() - now.getTime();
  
  // Schedule first cleanup
  setTimeout(() => {
    runCleanup();
    
    // Then run every 24 hours
    setInterval(runCleanup, 24 * 60 * 60 * 1000);
  }, msUntil2AM);
  
  console.log(`📅 Message cleanup scheduled for ${next2AM.toLocaleString()}`);
};

export default scheduleMessageCleanup;
