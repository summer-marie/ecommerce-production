import * as argon2 from "argon2";
import adminModel from "../admins/adminModel.js";

// POST /auth/change-password
// Requires JWT auth (passport.authenticate('jwt', { session: false }))
// Body: { currentPassword: string, newPassword: string }
const authChangePassword = async (req, res) => {
  // Change password request received
  
  try {
    const userId = req.user?._id;
    const rawCurrent = req.body?.currentPassword;
    const rawNew = req.body?.newPassword;
    const currentPassword = typeof rawCurrent === 'string' ? rawCurrent.trim() : rawCurrent;
    const newPassword = typeof rawNew === 'string' ? rawNew.trim() : rawNew;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters" });
    }
    if (String(newPassword).length > 128) {
      return res.status(400).json({ success: false, message: "New password must be at most 128 characters" });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ success: false, message: "New password must be different from current password" });
    }

    const user = await adminModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const valid = await argon2.verify(user.password, currentPassword);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await argon2.hash(newPassword);
    // Clear all sessions for security
    user.token = [];
    await user.save();

    // Clear cookie too
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        domain: "localhost",
        path: "/",
      });
    } catch {}

    return res.status(200).json({ 
      success: true, 
      message: "Password updated successfully", 
      requireRelogin: true 
    });
  } catch (err) {
    console.error("authChangePassword error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default authChangePassword;
