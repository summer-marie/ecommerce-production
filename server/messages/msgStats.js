import { checkMessageLimit } from "../utils/messageCleanup.js";

const messageStats = async (req, res) => {
  try {
    const stats = await checkMessageLimit();

    res.status(200).json({
      success: true,
      stats: {
        current: stats.current,
        limit: stats.limit,
        available: stats.available,
        percentUsed: Math.round((stats.current / stats.limit) * 100),
      },
    });
  } catch (error) {
    console.error("Error getting message stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get message statistics",
    });
  }
};

export default messageStats;
