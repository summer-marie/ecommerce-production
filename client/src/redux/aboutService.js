import { API_BASE } from "../utils/apiBase.js";

const aboutService = {
  async get() {
    const res = await fetch(`${API_BASE}/about`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to load about content");
    const data = await res.json();
    return data.about;
  },
  async update(payload) {
    const headers = { "Content-Type": "application/json" };

    const res = await fetch(`${API_BASE}/about`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to update about content");
    }
    const data = await res.json();
    return data.about;
  },
};

export default aboutService;
