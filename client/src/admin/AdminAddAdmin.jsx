import { useState } from "react";
import API_BASE from "../utils/apiBase";

export default function AdminAddAdmin() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "admin",
    status: "active",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setResult({ ok: false, message: "All fields are required" });
      return;
    }
    if (form.password.length < 6) {
      setResult({ ok: false, message: "Password must be at least 6 characters" });
      return;
    }
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/admins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
      }
      setResult({ ok: true, message: "Admin created successfully" });
      setForm({ firstName: "", lastName: "", email: "", password: "", role: "admin", status: "active" });
    } catch (err) {
      setResult({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl bg-white/90 shadow-xl ring-1 ring-slate-200 overflow-hidden">
          <div className="px-6 py-5 bg-gradient-to-r from-sky-600 to-indigo-600 text-white">
            <h1 className="text-xl md:text-2xl font-semibold">Add Admin</h1>
            <p className="text-white/90 text-sm mt-1">Create a new admin or manager account.</p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 md:p-7 space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">First name</label>
              <input
                className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Last name</label>
              <input
                className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Email</label>
              <input
                className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Password</label>
              <div className="relative">
                <input
                  className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 pr-10 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  type={showPwd ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  title={showPwd ? "Hide" : "Show"}
                >
                  {showPwd ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Role</label>
                <select
                  className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  name="role"
                  value={form.role}
                  onChange={onChange}
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-wide uppercase text-slate-600 mb-1">Status</label>
                <select
                  className="w-full rounded-lg border-0 ring-1 ring-slate-300 bg-gray-50/70 px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
                  name="status"
                  value={form.status}
                  onChange={onChange}
                >
                  <option value="active">active</option>
                  <option value="disabled">disabled</option>
                </select>
              </div>
            </div>
            <div className="pt-2">
              <button
                className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 py-2.5 font-medium shadow hover:from-emerald-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed transition"
                disabled={submitting}
                type="submit"
              >
                {submitting ? "Creating..." : "Create Admin"}
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
    </div>
  );
}
