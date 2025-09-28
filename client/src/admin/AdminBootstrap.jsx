import { useState } from "react";
import API_BASE from "../utils/apiBase";

// Temporary hidden route component to create an initial admin.
// Visit: http://localhost:3005/creation-val-id
// IMPORTANT: Remove/disable after first real admin is created.
export default function AdminBootstrap() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "admin",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/admins`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          data?.message || data?.error || `Request failed (${res.status})`
        );
      }
      setResult({
        ok: true,
        message: "Admin created successfully. Secure this route ASAP.",
      });
    } catch (err) {
      setResult({ ok: false, message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">
        Admin Bootstrap (Temporary)
      </h1>
      <p className="text-sm text-red-600 mb-4">
        This page lets you create an initial admin. Remove or lock it down after
        use.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm">First name</label>
          <input
            className="w-full border rounded p-2"
            name="firstName"
            value={form.firstName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Last name</label>
          <input
            className="w-full border rounded p-2"
            name="lastName"
            value={form.lastName}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            className="w-full border rounded p-2"
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            className="w-full border rounded p-2"
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            minLength={6}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Role</label>
            <select
              className="w-full border rounded p-2"
              name="role"
              value={form.role}
              onChange={onChange}
            >
              <option value="admin">admin</option>
              <option value="manager">manager</option>
            </select>
          </div>
          <div>
            <label className="block text-sm">Status</label>
            <select
              className="w-full border rounded p-2"
              name="status"
              value={form.status}
              onChange={onChange}
            >
              <option value="active">active</option>
              <option value="disabled">disabled</option>
            </select>
          </div>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={submitting}
          type="submit"
        >
          {submitting ? "Creating..." : "Create Admin"}
        </button>
      </form>
      {result && (
        <div
          className={`mt-4 text-sm ${
            result.ok ? "text-green-700" : "text-red-700"
          }`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
