import orderModel from "../orders/orderModel.js";
import mongoose from "mongoose";
import { getLog } from "../logger.js";

/**
 * Cleanup archived orders older than 30 days
 * This function deletes archived orders that are 30+ days old to maintain database performance
 * and comply with data retention policies while keeping recent archived orders for reference.
 */
const cleanupArchivedOrders = async () => {
  try {
    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const log = getLog(null, { operationId: 'cleanupArchivedOrders' });
  log.info({ event: 'script.cleanupArchived.start', cutoffDate: thirtyDaysAgo.toISOString().slice(0,10) }, 'Starting cleanup of archived orders');

    // Find and delete archived orders older than 30 days
    const result = await orderModel.deleteMany({
      status: "archived",
      date: { $lt: thirtyDaysAgo }
    });

    if (result.deletedCount > 0) {
  log.info({ event: 'script.cleanupArchived.deleted', deletedCount: result.deletedCount }, 'Deleted archived orders older than cutoff');
      
      // Log the cleanup for audit trail
      const logEntry = {
        timestamp: new Date(),
        action: "archived_orders_cleanup",
        deletedCount: result.deletedCount,
        cutoffDate: thirtyDaysAgo
      };
      
      return {
        success: true,
        deletedCount: result.deletedCount,
        cutoffDate: thirtyDaysAgo,
        message: `Successfully cleaned up ${result.deletedCount} archived orders`
      };
    } else {
  log.info({ event: 'script.cleanupArchived.none' }, 'No archived orders older than cutoff');
      return {
        success: true,
        deletedCount: 0,
        message: "No archived orders older than 30 days found"
      };
    }
  } catch (error) {
  const log = getLog(null, { operationId: 'cleanupArchivedOrders' });
  log.error({ event: 'script.cleanupArchived.error', err: error && error.message ? error.message : error }, 'Error during archived orders cleanup');
    return {
      success: false,
      error: error.message,
      message: "Failed to cleanup archived orders"
    };
  }
};

/**
 * Get count of archived orders that would be deleted in next cleanup
 */
const getCleanupPreview = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const count = await orderModel.countDocuments({
      status: "archived",
      date: { $lt: thirtyDaysAgo }
    });

    const recentArchived = await orderModel.countDocuments({
      status: "archived",
      date: { $gte: thirtyDaysAgo }
    });

    return {
      eligibleForDeletion: count,
      recentArchived: recentArchived,
      cutoffDate: thirtyDaysAgo
    };
  } catch (error) {
  const log = getLog(null, { operationId: 'cleanupArchivedOrders' });
  log.error({ event: 'script.cleanupArchived.previewError', err: error && error.message ? error.message : error }, 'Error getting cleanup preview');
    return null;
  }
};

// If this script is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState !== 1) {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    const log = getLog(null, { operationId: 'cleanupArchivedOrders' });
    if (!mongoUri) {
      log.error({ event: 'script.cleanupArchived.error', reason: 'missingMongoURI' }, 'MongoDB URI not found in env');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    log.info({ event: 'script.cleanupArchived.connected' }, 'Connected to MongoDB for cleanup');
  }

  // Run the cleanup
  const result = await cleanupArchivedOrders();
  const log = getLog(null, { operationId: 'cleanupArchivedOrders' });
  log.info({ event: 'script.cleanupArchived.result', result }, 'Cleanup result');
  
  // Close the connection if we opened it
  if (mongoose.connection.readyState === 1) {
  await mongoose.disconnect();
  const log2 = getLog(null, { operationId: 'cleanupArchivedOrders' });
  log2.info({ event: 'script.cleanupArchived.done' }, 'Disconnected from MongoDB');
  }
  
  process.exit(result.success ? 0 : 1);
}

export { cleanupArchivedOrders, getCleanupPreview };
