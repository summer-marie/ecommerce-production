import adminModel from "../admins/adminModel.js";

const authLogout = async (req, res) => {
  console.log("auth logout", req.user);

  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  try {
    // Simplified: clear all tokens for now
    await adminModel.findByIdAndUpdate(
      req.user._id,
      { $set: { token: [] } },
      { new: true }
    );

    // Clear token cookie if present
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        domain: "localhost",
        path: "/",
      });
    } catch {}

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Error logging out." });
  }
};
export default authLogout;
