import { cleanupOldMessages } from "../utils/messageCleanup.js";
import { getLog } from "../utils/logger.js";

// Schedule daily cleanup at 2 AM
const scheduleMessageCleanup = () => {
  const runCleanup = async () => {
    const log = getLog(null, { event: 'messages.cleanup.scheduled' });
    log.info('running scheduled message cleanup');
    const deletedCount = await cleanupOldMessages();

    if (deletedCount > 0) {
      log.info({ deleted: deletedCount }, 'daily cleanup removed old messages');
    } else {
      log.info('daily cleanup no old messages');
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

  const log = getLog(null, { event: 'messages.cleanup.schedule' });
  log.info({ nextRun: next2AM.toISOString() }, 'message cleanup scheduled');
};

export default scheduleMessageCleanup;
