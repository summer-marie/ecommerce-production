import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changePassword, changeEmail, status } from "../redux/authSlice";

export default function AdminChangePassword() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const dispatch = useDispatch();
  const authUser = useSelector((state) => state.auth.authUser);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  
  // Email modal state
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ newEmail: "", password: "" });
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [emailSubmitting, setEmailSubmitting] = useState(false);
  const [emailResult, setEmailResult] = useState(null);

  // Refresh user data if email is missing (for users logged in before the fix)
  useEffect(() => {
    if (authUser && authUser.id && !authUser.email) {
      console.log("Email missing from user object, refreshing user data...");
      dispatch(status());
    }
  }, [authUser, dispatch]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const toggle = (key) => setShow((s) => ({ ...s, [key]: !s[key] }));

  const onEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailForm((s) => ({ ...s, [name]: value }));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (emailResult) setEmailResult(null);
    
    if (!emailForm.newEmail || !emailForm.password) {
      setEmailResult({ ok: false, message: "Please fill in all fields" });
      return;
    }

    try {
      setEmailSubmitting(true);
      const action = await dispatch(
        changeEmail({
          newEmail: emailForm.newEmail,
          password: emailForm.password,
        })
      );
      if (changeEmail.fulfilled.match(action)) {
        setEmailForm({ newEmail: "", password: "" });
        setEmailResult({ ok: true, message: "Email updated successfully" });
        setTimeout(() => setShowEmailModal(false), 2000);
      } else if (changeEmail.rejected.match(action)) {
        setEmailResult({ ok: false, message: action.payload || "Email update failed" });
      }
    } catch (err) {
      console.warn("Change email dispatch error", err);
      setEmailResult({ ok: false, message: "Email update failed" });
    } finally {
      setEmailSubmitting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  if (result) setResult(null);
  if (form.newPassword !== form.confirmPassword) {
      // emulate result shape locally for quick feedback
      // Keeping component-local message avoids creating extra slice actions
      alert("Passwords do not match");
      return;
    }
    try {
      setSubmitting(true);
      const action = await dispatch(
        changePassword({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        })
      );
      if (changePassword.fulfilled.match(action)) {
        setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setResult({ ok: true, message: action.payload?.requireRelogin ? "Password updated. Please log in again." : "Password updated successfully" });
      } else if (changePassword.rejected.match(action)) {
        setResult({ ok: false, message: action.payload || "Change password failed" });
      }
    } catch (err) {
      // Swallow; slice already captured message
      console.warn("Change password dispatch error", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl bg-white/90 shadow-xl ring-1 ring-slate-200 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
            <h1 className="text-xl md:text-2xl font-semibold">Change Password</h1>
            <p className="text-white/90 text-sm mt-1">Update your password to keep your account secure.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Current password</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  type={show.current ? "text" : "password"}
                  name="currentPassword"
                  value={form.currentPassword}
                  onChange={onChange}
                  required
                />
                <button
                  type="button"
                  aria-label={show.current ? "Hide password" : "Show password"}
                  onClick={() => toggle("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {show.current ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.81 2.87-5.11 5.2-6.52M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3 11 8-.56 1.55-1.44 2.95-2.54 4.09M14.12 14.12A3 3 0 0 1 9.88 9.88M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">New password</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  type={show.next ? "text" : "password"}
                  name="newPassword"
                  value={form.newPassword}
                  onChange={onChange}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  aria-label={show.next ? "Hide password" : "Show password"}
                  onClick={() => toggle("next")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {show.next ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.81 2.87-5.11 5.2-6.52M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3 11 8-.56 1.55-1.44 2.95-2.54 4.09M14.12 14.12A3 3 0 0 1 9.88 9.88M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Confirm new password</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  type={show.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={onChange}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  aria-label={show.confirm ? "Hide password" : "Show password"}
                  onClick={() => toggle("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {show.confirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.81 2.87-5.11 5.2-6.52M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3 11 8-.56 1.55-1.44 2.95-2.54 4.09M14.12 14.12A3 3 0 0 1 9.88 9.88M1 1l22 22" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="mt-1 text-xs text-slate-500">Minimum 6 characters.</p>
            </div>
            <div className="pt-2 space-y-3">
              <button
                className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 font-medium shadow hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                disabled={submitting}
              >
                {submitting ? "Updating..." : "Update Password"}
              </button>
              
              <button
                type="button"
                onClick={() => setShowEmailModal(true)}
                className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-medium shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                Update Email
              </button>
            </div>
            {result && (
              <div
                className={`mt-2 text-sm rounded-lg px-3 py-2 ring-1 ${
                  result.ok
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-rose-50 text-rose-700 ring-rose-200"
                }`}
              >
                {result.message}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Email Update Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/90 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md">
            <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 overflow-hidden">
              <div className="px-6 py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Update Email</h2>
                    <p className="text-white/90 text-sm mt-1">
                      Current: <span className="font-medium">{authUser?.email || "Not available"}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-1 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              </div>
              <form onSubmit={handleEmailSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">New Email</label>
                  <input
                    className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                    type="email"
                    name="newEmail"
                    value={emailForm.newEmail}
                    onChange={onEmailChange}
                    placeholder="Enter new email address"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Confirm Password</label>
                  <div className="relative">
                    <input
                      className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      type={showEmailPassword ? "text" : "password"}
                      name="password"
                      value={emailForm.password}
                      onChange={onEmailChange}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      aria-label={showEmailPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowEmailPassword(!showEmailPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    >
                      {showEmailPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-8 1.02-2.81 2.87-5.11 5.2-6.52M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3 11 8-.56 1.55-1.44 2.95-2.54 4.09M14.12 14.12A3 3 0 0 1 9.88 9.88M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">Required for security verification.</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="flex-1 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-700 px-4 py-2.5 font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 font-medium shadow hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                    disabled={emailSubmitting}
                  >
                    {emailSubmitting ? "Updating..." : "Update Email"}
                  </button>
                </div>
                {emailResult && (
                  <div
                    className={`mt-2 text-sm rounded-lg px-3 py-2 ring-1 ${
                      emailResult.ok
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : "bg-rose-50 text-rose-700 ring-rose-200"
                    }`}
                  >
                    {emailResult.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
