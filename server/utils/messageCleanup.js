import messageModel from "../messages/msgModel.js";

// Message cleanup utilities
export const cleanupOldMessages = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const result = await messageModel.deleteMany({
      date: { $lt: thirtyDaysAgo }
    });
    
    console.log(`🧹 Cleanup: Deleted ${result.deletedCount} messages older than 30 days`);
    return result.deletedCount;
  } catch (error) {
    console.error("❌ Message cleanup failed:", error);
    return 0;
  }
};

// Check if message limit would be exceeded
export const checkMessageLimit = async () => {
  try {
    const messageLimit = parseInt(process.env.MESSAGE_LIMIT || "100");
    const currentCount = await messageModel.countDocuments();
    
    return {
      limit: messageLimit,
      current: currentCount,
      available: Math.max(0, messageLimit - currentCount),
      limitReached: currentCount >= messageLimit
    };
  } catch (error) {
    console.error("❌ Message limit check failed:", error);
    return { limitReached: false, current: 0, limit: 100, available: 100 };
  }
};

// Clean up oldest messages to make room for new ones
export const cleanupOldestMessages = async (countToRemove = 1) => {
  try {
    const oldestMessages = await messageModel
      .find()
      .sort({ date: 1 })
      .limit(countToRemove)
      .select('_id');
    
    const idsToDelete = oldestMessages.map(msg => msg._id);
    
    const result = await messageModel.deleteMany({
      _id: { $in: idsToDelete }
    });
    
    console.log(`🧹 Cleanup: Removed ${result.deletedCount} oldest messages to make room`);
    return result.deletedCount;
  } catch (error) {
    console.error("❌ Oldest message cleanup failed:", error);
    return 0;
  }
};
