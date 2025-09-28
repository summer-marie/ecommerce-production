import messageModel from "../messages/msgModel.js";
import { getLog } from "../utils/logger.js";

// Message cleanup utilities
export const cleanupOldMessages = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const log = getLog(null, { event: 'messages.cleanup.old' });
    const result = await messageModel.deleteMany({
      date: { $lt: thirtyDaysAgo },
    });
    log.info({ deleted: result.deletedCount }, 'deleted old messages');
    return result.deletedCount;
  } catch (error) {
    const log = getLog(null, { event: 'messages.cleanup.old.error' });
    log.error({ err: error?.message }, 'message cleanup failed');
    return 0;
  }
};

// Check if message limit would be exceeded
export const checkMessageLimit = async () => {
  try {
  const log = getLog(null, { event: 'messages.limit.check' });
  const messageLimit = parseInt(process.env.MESSAGE_LIMIT || "100");
    const currentCount = await messageModel.countDocuments();

    return {
      limit: messageLimit,
      current: currentCount,
      available: Math.max(0, messageLimit - currentCount),
      limitReached: currentCount >= messageLimit,
    };
  } catch (error) {
    const log = getLog(null, { event: 'messages.limit.check.error' });
    log.error({ err: error?.message }, 'message limit check failed');
    return { limitReached: false, current: 0, limit: 100, available: 100 };
  }
};

// Clean up oldest messages to make room for new ones
export const cleanupOldestMessages = async (countToRemove = 1) => {
  try {
    const log = getLog(null, { event: 'messages.cleanup.oldest' });
    const oldestMessages = await messageModel
      .find()
      .sort({ date: 1 })
      .limit(countToRemove)
      .select("_id");

    const idsToDelete = oldestMessages.map((msg) => msg._id);

    const result = await messageModel.deleteMany({
      _id: { $in: idsToDelete },
    });
    log.info({ removed: result.deletedCount }, 'removed oldest messages to make room');
    return result.deletedCount;
  } catch (error) {
    const log = getLog(null, { event: 'messages.cleanup.oldest.error' });
    log.error({ err: error?.message }, 'oldest message cleanup failed');
    return 0;
  }
};
