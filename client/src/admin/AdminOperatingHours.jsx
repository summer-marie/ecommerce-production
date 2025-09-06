import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "../utils/apiBase";
import { useSelector } from "react-redux";

const weekdays = [
  { key: "sun", label: "Sunday" },
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
];

export default function AdminOperatingHours() {
  const token = useSelector((s) => s.auth.token);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [cfg, setCfg] = useState({
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  devForceOpen: false,
    forceClosed: false,
  adminAlertEmails: [],
    bannerMessageClosed: "We're closed right now. Please check back soon.",
    bannerMessageOpen: "We're open and accepting orders!",
    weeklyHours: {},
    specialOpenWindows: [],
  });
  const authHeader = useMemo(
    () => (token ? { Authorization: `Bearer ${token}` } : {}),
    [token]
  );

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/operating-hours`, {
          headers: authHeader,
          withCredentials: true,
        });
        const cfgData = data?.config || {};
        setCfg((c) => ({
          ...c,
          timezone: cfgData.timezone || c.timezone,
          devForceOpen: !!cfgData.devForceOpen,
          forceClosed: !!cfgData.forceClosed,
          adminAlertEmails: Array.isArray(cfgData.adminAlertEmails) ? cfgData.adminAlertEmails : [],
          bannerMessageClosed: cfgData.bannerMessageClosed || c.bannerMessageClosed,
          bannerMessageOpen: cfgData.bannerMessageOpen || c.bannerMessageOpen,
          weeklyHours: cfgData.weeklyHours || {},
          specialOpenWindows: cfgData.specialOpenWindows || [],
        }));
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };
    load();
  }, [authHeader]);

  const updateWeekly = (day, idx, field, value) => {
    setCfg((c) => {
      const list = Array.isArray(c.weeklyHours?.[day]) ? [...c.weeklyHours[day]] : [];
      list[idx] = { ...list[idx], [field]: value };
      return { ...c, weeklyHours: { ...c.weeklyHours, [day]: list } };
    });
  };
  const addWindow = (day) => {
    setCfg((c) => {
      const list = Array.isArray(c.weeklyHours?.[day]) ? [...c.weeklyHours[day]] : [];
      list.push({ start: "09:00", end: "17:00" });
      return { ...c, weeklyHours: { ...c.weeklyHours, [day]: list } };
    });
  };
  const removeWindow = (day, idx) => {
    setCfg((c) => {
      const list = Array.isArray(c.weeklyHours?.[day]) ? [...c.weeklyHours[day]] : [];
      list.splice(idx, 1);
      return { ...c, weeklyHours: { ...c.weeklyHours, [day]: list } };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      // Basic validation for special windows
      const invalid = (cfg.specialOpenWindows || []).some((w) => {
        if (!w?.start || !w?.end) return true;
        const s = new Date(w.start);
        const e = new Date(w.end);
        return !(s instanceof Date && !isNaN(s)) || !(e instanceof Date && !isNaN(e)) || e <= s;
      });
      if (invalid) {
        setFormError("Please ensure all special windows have valid start/end and that end is after start.");
        return;
      }
      setFormError("");
      const payload = {
        timezone: cfg.timezone,
  devForceOpen: !!cfg.devForceOpen,
        forceClosed: !!cfg.forceClosed,
  adminAlertEmails: (cfg.adminAlertEmails || []).filter(Boolean),
        bannerMessageClosed: cfg.bannerMessageClosed,
        bannerMessageOpen: cfg.bannerMessageOpen,
        weeklyHours: cfg.weeklyHours,
        specialOpenWindows: cfg.specialOpenWindows,
      };
  await axios.put(`${API_BASE}/operating-hours`, payload, {
        headers: { "Content-Type": "application/json", ...authHeader },
        withCredentials: true,
      });
      setCfg((c) => ({ ...c, ...payload }));
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6 text-slate-300">Loading...</div>;

  return (
    <div className="p-6 text-slate-200">
      <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-zinc-500/40 via-zinc-300/20 to-zinc-600/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)] mb-6">
        <div className="relative z-10 rounded-2xl bg-gradient-to-b from-black/80 via-slate-900/80 to-slate-800/70 border border-white/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-slate-100 tracking-wide">Operating Hours & Ordering</h1>
              <p className="text-sm text-slate-300">
                Control when customers can place orders. Show a banner on the site and disable ordering UI when closed.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              className="text-xs px-3 py-1.5 rounded border border-purple-500/60 bg-purple-800/80 hover:bg-purple-700/80 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_6px_rgba(91,33,182,0.35)] self-start"
            >
              {showHelp ? "Hide help" : "How this page works"}
            </button>
          </div>
        </div>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-70" />
        <div className="pointer-events-none absolute -top-8 -left-10 w-2/3 h-24 rotate-[-20deg] bg-white/10 blur-md opacity-15" />
      </div>

      <div className="mb-6">
        {showHelp && (
          <div className="mt-3 rounded-xl border border-slate-600 bg-slate-900/80 p-4 text-slate-100 text-sm">
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed marker:text-purple-300">
              <li>
                Weekly Hours: Add one or more time windows per day (in your business timezone). Leave a day empty to be closed.
              </li>
              <li>
                Special Open Windows: Date/time ranges for one-off openings (e.g., open once a month). These override weekly hours during the window.
              </li>
              <li>
                Force Closed: Immediately stops ordering regardless of schedules (use for emergencies or breaks).
              </li>
              <li>
                Timezone: Used to evaluate weekly hours and banners. Changing it affects future schedule calculations.
              </li>
              <li>
                Banners: Customize messages shown to customers when open/closed.
              </li>
              <li>
                Save Changes: Click Save to apply. Customers may need to refresh to see updated banners immediately.
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-slate-900/40 rounded-xl border border-slate-700 p-4 lg:col-span-2">
          <h2 className="font-semibold mb-3">Weekly Hours</h2>
          <div className="space-y-4">
            {weekdays.map((d) => (
              <div key={d.key} className="bg-slate-800/40 rounded-lg p-3 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{d.label}</span>
                  <button
                    type="button"
                    onClick={() => addWindow(d.key)}
                    className="text-xs px-2 py-1 rounded bg-sky-700 hover:bg-sky-600"
                  >
                    Add window
                  </button>
                </div>
                <div className="space-y-2">
                  {(cfg.weeklyHours?.[d.key] || []).map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={w.start || ""}
                        onChange={(e) => updateWeekly(d.key, i, "start", e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={w.end || ""}
                        onChange={(e) => updateWeekly(d.key, i, "end", e.target.value)}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeWindow(d.key, i)}
                        className="text-xs px-2 py-1 rounded bg-red-700 hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {!(cfg.weeklyHours?.[d.key] || []).length && (
                    <div className="text-xs text-slate-400">Closed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/40 rounded-xl border border-slate-700 p-4 space-y-4">
          <h2 className="font-semibold">Settings</h2>
          {formError && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded p-2">{formError}</div>
          )}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!cfg.devForceOpen}
              onChange={(e) => setCfg((c) => ({ ...c, devForceOpen: e.target.checked }))}
            />
            Developer: Force open (override schedules)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!cfg.forceClosed}
              onChange={(e) => setCfg((c) => ({ ...c, forceClosed: e.target.checked }))}
            />
            Force closed now
          </label>
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">Admin alert recipients</label>
            <div className="space-y-2">
              {(cfg.adminAlertEmails || []).map((em, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={em}
                    onChange={(e) =>
                      setCfg((c) => {
                        const list = [...(c.adminAlertEmails || [])];
                        list[i] = e.target.value;
                        return { ...c, adminAlertEmails: list };
                      })
                    }
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setCfg((c) => {
                        const list = [...(c.adminAlertEmails || [])];
                        list.splice(i, 1);
                        return { ...c, adminAlertEmails: list };
                      })
                    }
                    className="text-xs px-2 py-1 rounded bg-red-700 hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setCfg((c) => ({ ...c, adminAlertEmails: [...(c.adminAlertEmails || []), ""] }))}
                className="text-xs px-2 py-1 rounded bg-sky-700 hover:bg-sky-600"
              >
                Add recipient
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">Timezone</label>
              <input
                type="text"
                value={cfg.timezone || ""}
                onChange={(e) => setCfg((c) => ({ ...c, timezone: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
                placeholder="e.g. America/New_York"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">Open banner message</label>
              <input
                type="text"
                value={cfg.bannerMessageOpen || ""}
                onChange={(e) => setCfg((c) => ({ ...c, bannerMessageOpen: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">Closed banner message</label>
              <input
                type="text"
                value={cfg.bannerMessageClosed || ""}
                onChange={(e) => setCfg((c) => ({ ...c, bannerMessageClosed: e.target.value }))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">Special open windows</label>
              <div className="space-y-2">
                {(cfg.specialOpenWindows || []).map((w, i) => (
                  <div key={i} className="flex flex-col gap-2 bg-slate-800/40 rounded-lg p-2 border border-slate-700">
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="datetime-local"
                        value={w.start ? new Date(w.start).toISOString().slice(0, 16) : ""}
                        onChange={(e) =>
                          setCfg((c) => {
                            const arr = [...(c.specialOpenWindows || [])];
                            // Convert local datetime to ISO (UTC) for backend
                            const iso = e.target.value ? new Date(e.target.value).toISOString() : "";
                            arr[i] = { ...arr[i], start: iso };
                            return { ...c, specialOpenWindows: arr };
                          })
                        }
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <span>to</span>
                      <input
                        type="datetime-local"
                        value={w.end ? new Date(w.end).toISOString().slice(0, 16) : ""}
                        onChange={(e) =>
                          setCfg((c) => {
                            const arr = [...(c.specialOpenWindows || [])];
                            const iso = e.target.value ? new Date(e.target.value).toISOString() : "";
                            arr[i] = { ...arr[i], end: iso };
                            return { ...c, specialOpenWindows: arr };
                          })
                        }
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Note (optional)"
                        value={w.note || ""}
                        onChange={(e) =>
                          setCfg((c) => {
                            const arr = [...(c.specialOpenWindows || [])];
                            arr[i] = { ...arr[i], note: e.target.value };
                            return { ...c, specialOpenWindows: arr };
                          })
                        }
                        className="flex-1 min-w-[160px] bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setCfg((c) => {
                            const arr = [...(c.specialOpenWindows || [])];
                            arr.splice(i, 1);
                            return { ...c, specialOpenWindows: arr };
                          })
                        }
                        className="text-xs px-2 py-1 rounded bg-red-700 hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    {w.start && w.end && new Date(w.end) <= new Date(w.start) && (
                      <div className="text-xs text-red-400">End must be after start.</div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setCfg((c) => ({
                      ...c,
                      specialOpenWindows: [
                        ...(c.specialOpenWindows || []),
                        { start: new Date().toISOString(), end: new Date(Date.now() + 3600000).toISOString() },
                      ],
                    }))
                  }
                  className="text-xs px-2 py-1 rounded bg-sky-700 hover:bg-sky-600"
                >
                  Add special window
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full py-2 rounded bg-emerald-700 hover:bg-emerald-600 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </section>
      </div>
    </div>
  );
}
