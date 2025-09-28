import { getLog } from "../utils/logger.js";

const authStatus = (req, res, next) => {
  const log = getLog(req, { event: 'auth.status' });
  log.debug({ hasUser: !!req.user, userId: req.user?._id }, 'auth status check');

  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated",
      user: null,
    });
  } else {
    return res.status(200).json({
      success: true,
      message: "Authenticated successfully",
      user: {
        firstName: req.user.firstName,
        email: req.user.email,
        role: req.user.role,
        id: req.user._id,
      },
    });
  }
};

export default authStatus;
