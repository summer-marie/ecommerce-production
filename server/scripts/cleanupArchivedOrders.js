import orderModel from "../orders/orderModel.js";
import mongoose from "mongoose";

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

    console.log(`🗑️  Starting cleanup of archived orders older than ${thirtyDaysAgo.toLocaleDateString()}`);

    // Find and delete archived orders older than 30 days
    const result = await orderModel.deleteMany({
      status: "archived",
      date: { $lt: thirtyDaysAgo }
    });

    if (result.deletedCount > 0) {
      console.log(`✅ Successfully deleted ${result.deletedCount} archived orders older than 30 days`);
      
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
      console.log("ℹ️  No archived orders older than 30 days found for cleanup");
      return {
        success: true,
        deletedCount: 0,
        message: "No archived orders older than 30 days found"
      };
    }
  } catch (error) {
    console.error("❌ Error during archived orders cleanup:", error);
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
    console.error("Error getting cleanup preview:", error);
    return null;
  }
};

// If this script is run directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  // Connect to MongoDB if not already connected
  if (mongoose.connection.readyState !== 1) {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MongoDB URI not found in environment variables");
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log("📱 Connected to MongoDB for cleanup");
  }

  // Run the cleanup
  const result = await cleanupArchivedOrders();
  console.log("Cleanup result:", result);
  
  // Close the connection if we opened it
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    console.log("📱 Disconnected from MongoDB");
  }
  
  process.exit(result.success ? 0 : 1);
}

export { cleanupArchivedOrders, getCleanupPreview };
