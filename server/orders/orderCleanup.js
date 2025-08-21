import { cleanupArchivedOrders, getCleanupPreview } from "../scripts/cleanupArchivedOrders.js";

/**
 * Manual cleanup endpoint for admin use
 * DELETE /api/orders/cleanup-archived
 */
const orderCleanupArchived = async (req, res) => {
  try {
    console.log("🗑️  Manual cleanup of archived orders initiated by admin");
    
    const result = await cleanupArchivedOrders();
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        deletedCount: result.deletedCount,
        cutoffDate: result.cutoffDate
      });
    } else {
      res.status(500).json({
        success: false,
        message: result.message,
        error: result.error
      });
    }
  } catch (error) {
    console.error("Error in manual cleanup endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during cleanup",
      error: error.message
    });
  }
};

/**
 * Get cleanup preview information
 * GET /api/orders/cleanup-preview
 */
const orderGetCleanupPreview = async (req, res) => {
  try {
    const preview = await getCleanupPreview();
    
    if (preview) {
      res.status(200).json({
        success: true,
        preview
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to get cleanup preview"
      });
    }
  } catch (error) {
    console.error("Error getting cleanup preview:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export { orderCleanupArchived, orderGetCleanupPreview };
