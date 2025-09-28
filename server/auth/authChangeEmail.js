import adminModel from "../admins/adminModel.js";
import { getLog } from "../utils/logger.js";

// POST /auth/change-email
// Requires JWT auth (passport.authenticate('jwt', { session: false }))
// Body: { newEmail: string, password: string }
const authChangeEmail = async (req, res) => {
  // Change email request received
  
  const log = getLog(req, { event: 'auth.changeEmail' });
  try {
    const userId = req.user?._id;
    const rawEmail = req.body?.newEmail;
    const rawPassword = req.body?.password;
    const newEmail = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : rawEmail;
    const password = typeof rawPassword === 'string' ? rawPassword.trim() : rawPassword;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    if (!newEmail || !password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    // Check if email is already in use by another admin
    const existingAdmin = await adminModel.findOne({ 
      email: newEmail, 
      _id: { $ne: userId } 
    });
    if (existingAdmin) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const user = await adminModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password before allowing email change
    const argon2 = await import("argon2");
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Password is incorrect" });
    }

    // Check if new email is the same as current
    if (user.email === newEmail) {
      return res.status(400).json({ success: false, message: "New email must be different from current email" });
    }

    user.email = newEmail;
    await user.save();

    return res.status(200).json({ 
      success: true, 
      message: "Email updated successfully",
      newEmail: newEmail
    });
  } catch (err) {
    log.error({ err: err?.message }, 'auth change email error');
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export default authChangeEmail;
