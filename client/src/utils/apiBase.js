// Central API base resolution so we can switch env var names without touching every service file.
// Order: VITE_API_SERVER_URL (legacy) -> VITE_API_BASE (new) -> localhost fallback.
export const API_BASE = (
  import.meta.env.VITE_API_SERVER_URL ||
  import.meta.env.VITE_API_BASE ||
  "http://localhost:8010"
).replace(/\/$/, "");

export default API_BASE;
