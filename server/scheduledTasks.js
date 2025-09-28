import cron from "node-cron";
import { cleanupArchivedOrders } from "./scripts/cleanupArchivedOrders.js";
import { getLog } from "./logger.js";

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
    const log = getLog(null, { operationId: 'scheduleArchivedOrdersCleanup' });
    log.info({ event: 'schedule.archivedOrders.start', at: new Date().toISOString() }, 'Starting scheduled archived orders cleanup');
    try {
      const result = await cleanupArchivedOrders();
      if (result.success && result.deletedCount > 0) {
        log.info({ event: 'schedule.archivedOrders.completed', deletedCount: result.deletedCount }, 'Scheduled cleanup deleted orders');
      } else if (result.success && result.deletedCount === 0) {
        log.info({ event: 'schedule.archivedOrders.none' }, 'Scheduled cleanup found no orders to delete');
      } else {
        log.error({ event: 'schedule.archivedOrders.failed', error: result.error }, 'Scheduled cleanup failed');
      }
    } catch (error) {
      log.error({ event: 'schedule.archivedOrders.error', err: error && error.message ? error.message : error }, 'Error executing scheduled cleanup');
    }
  }, {
    scheduled: true,
    timezone: "America/New_York" // Adjust timezone as needed
  });
  const log = getLog(null, { operationId: 'scheduleArchivedOrdersCleanup' });
  log.info({ event: 'schedule.archivedOrders.scheduled', cron: '0 2 * * *', timezone: 'America/New_York' }, 'Archived orders cleanup scheduled');
};

/**
 * Initialize all scheduled tasks
 * Call this function from your main server file to start all cron jobs
 */
const initializeScheduledTasks = () => {
  const log = getLog(null, { operationId: 'scheduledTasksInit' });
  log.info({ event: 'schedule.init.start' }, 'Initializing scheduled tasks');
  
  scheduleArchivedOrdersCleanup();
  
  // Add other scheduled tasks here in the future
  // Example:
  // scheduleBackups();
  // scheduleReports();
  
  log.info({ event: 'schedule.init.done' }, 'All scheduled tasks initialized');
};

export { initializeScheduledTasks, scheduleArchivedOrdersCleanup };
