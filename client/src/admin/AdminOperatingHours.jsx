import { useEffect, useState } from "react";
import { logger } from "../utils/logger";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchOperatingConfig,
  updateOperatingConfig,
  updateConfigField,
  updateWeeklyHours,
  updateSpecialWindows,
} from "../redux/operatingSlice";

// Days of the week configuration for the weekly hours interface
const weekdays = [
  { key: "sun", label: "Sunday" },
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
  { key: "sat", label: "Saturday" },
];

/**
 * AdminOperatingHours Component
 *
 * Manages the restaurant's operating hours and ordering configuration.
 * Features:
 * - Weekly recurring hours (multiple time windows per day)
 * - Special one-time opening windows (e.g., holiday hours)
 * - Force open/closed overrides for emergencies
 * - Admin alert email configuration
 * - Arizona timezone enforcement (no DST complications)
 */
export default function AdminOperatingHours() {
  const dispatch = useDispatch();

  // Get operating hours state from Redux store
  const { config, loading, saving, error } = useSelector(
    (state) => state.operating
  );
  const [formError, setFormError] = useState("");
  const [showHelp, setShowHelp] = useState(false);

  // Always load operating hours configuration on mount (auth already enforced by route-level protections)
  useEffect(() => {
    logger.debug("Fetching operating config (simplified page)");
    dispatch(fetchOperatingConfig());
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    logger.debug("Operating hours state", { config, loading, saving, error });
  }, [config, loading, saving, error]);

  // Weekly hours management functions
  /**
   * Updates a specific time field (start or end) for a weekly hours window
   * @param {string} day - Day of week key
   * @param {number} idx - Index of the time window for that day
   * @param {string} field - Field to update ('start' or 'end')
   * @param {string} value - New time value (HH:MM format)
   */
  const updateWeeklyHour = (day, idx, field, value) => {
    const list = Array.isArray(config?.weeklyHours?.[day])
      ? [...config.weeklyHours[day]]
      : [];
    list[idx] = { ...list[idx], [field]: value };
    dispatch(updateWeeklyHours({ day, hours: list }));
  };

  /**
   * Adds a new operating hours window for a specific day
   * Defaults to 9:00 AM - 5:00 PM
   * @param {string} day - Day of week key (sun, mon, tue, etc.)
   */
  const addWindow = (day) => {
    const list = Array.isArray(config?.weeklyHours?.[day])
      ? [...config.weeklyHours[day]]
      : [];
    list.push({ start: "09:00", end: "17:00" });
    dispatch(updateWeeklyHours({ day, hours: list }));
  };

  /**
   * Removes an operating hours window for a specific day
   * @param {string} day - Day of week key (sun, mon, tue, etc.)
   * @param {number} idx - Index of the window to remove
   */
  const removeWindow = (day, idx) => {
    const list = Array.isArray(config?.weeklyHours?.[day])
      ? [...config.weeklyHours[day]]
      : [];
    list.splice(idx, 1);
    dispatch(updateWeeklyHours({ day, hours: list }));
  };

  // save changes to the server
  const save = async () => {
    try {
      // Validate special opening windows - ensure all have valid dates and end > start
      const invalid = (config?.specialOpenWindows || []).some((w) => {
        if (!w?.start || !w?.end) return true;
        const s = new Date(w.start);
        const e = new Date(w.end);
        return (
          !(s instanceof Date && !isNaN(s)) ||
          !(e instanceof Date && !isNaN(e)) ||
          e <= s
        );
      });

      if (invalid) {
        setFormError(
          "Please ensure all special windows have valid start/end and that end is after start."
        );
        return;
      }

      setFormError("");

      // Prepare payload with Arizona timezone enforcement and cleaned email list
      const payload = {
        ...config,
        timezone: "America/Phoenix", // Always force Arizona timezone
        adminAlertEmails: (config?.adminAlertEmails || []).filter(Boolean), // Remove empty emails
      };

      // Save configuration via Redux thunk
      await dispatch(updateOperatingConfig(payload)).unwrap();
    } catch (e) {
      logger.error(e);
      setFormError("Failed to save changes. Please try again.");
    }
  };

  // Loading states
  if (loading)
    return (
      <div className="p-6 text-slate-300">
        Loading operating hours configuration...
      </div>
    );

  // Removed explicit login gate: assume routing only exposes this to authenticated admins.

  // Error states (401 or other)
  if (error) {
    return (
      <div className="p-6 text-slate-300">
        <div className="bg-red-900/40 border border-red-700 rounded p-4 mb-4">
          <h3 className="text-red-400 font-semibold mb-2">
            Error Loading Configuration
          </h3>
          <p className="text-sm text-red-300 mb-4">{error}</p>
          <button
            onClick={() => dispatch(fetchOperatingConfig())}
            className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No configuration found
  if (!config) {
    return (
      <div className="p-6 text-slate-300">
        <div className="bg-yellow-900/40 border border-yellow-700 rounded p-4">
          <h3 className="text-yellow-400 font-semibold mb-2">
            No Configuration Found
          </h3>
          <p className="text-sm text-yellow-300 mb-4">
            Operating hours configuration could not be loaded. This might be a
            first-time setup.
          </p>
          <button
            onClick={() => dispatch(fetchOperatingConfig())}
            className="px-4 py-2 bg-yellow-700 hover:bg-yellow-600 text-white rounded text-sm"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-slate-200">
      {/* HEADER */}
      <div className="relative overflow-hidden rounded-2xl p-[1px] bg-gradient-to-br from-zinc-500/40 via-zinc-300/20 to-zinc-600/40 shadow-[0_8px_30px_rgba(0,0,0,0.35)] mb-6">
        <div className="relative z-10 rounded-2xl bg-gradient-to-b from-black/80 via-slate-900/80 to-slate-800/70 border border-white/10 p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2 text-slate-100 tracking-wide">
                Operating Hours & Ordering
              </h1>
              <p className="text-sm text-slate-300">
                Control when customers can place orders. Show a banner on the
                site and disable ordering UI when closed.
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

      {/* Help Toggle */}
      <div className="mb-6">
        {showHelp && (
          <div className="mt-3 rounded-xl border border-slate-600 bg-slate-900/80 p-4 text-slate-100 text-sm">
            <ul className="list-disc pl-5 space-y-1.5 leading-relaxed marker:text-purple-300">
              <li>
                Weekly Hours: Add one or more time windows per day (in your
                business timezone). Leave a day empty to be closed.
              </li>
              <li>
                Special Open Windows: Date/time ranges for one-off openings
                (e.g., open once a month). These override weekly hours during
                the window.
              </li>
              <li>
                Force Closed: Immediately stops ordering regardless of schedules
                (use for emergencies or breaks).
              </li>
              <li>
                Timezone: Used to evaluate weekly hours and closed banner.
                Changing it affects future schedule calculations.
              </li>
              <li>
                Closed Banner: Customize message shown to customers when closed.
              </li>
              <li>
                Save Changes: Click Save to apply. Customers may need to refresh
                to see updated banners immediately.
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
              <div
                key={d.key}
                className="bg-slate-800/40 rounded-lg p-3 border border-slate-700"
              >
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
                  {(config.weeklyHours?.[d.key] || []).map((w, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={w.start || ""}
                        onChange={(e) =>
                          updateWeeklyHour(d.key, i, "start", e.target.value)
                        }
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <span>to</span>
                      <input
                        type="time"
                        value={w.end || ""}
                        onChange={(e) =>
                          updateWeeklyHour(d.key, i, "end", e.target.value)
                        }
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
                  {!(config.weeklyHours?.[d.key] || []).length && (
                    <div className="text-xs text-slate-400">Closed</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Settings */}
        <section className="bg-slate-900/40 rounded-xl border border-slate-700 p-4 space-y-4">
          <h2 className="font-semibold">Settings</h2>

          {/* Form error display */}
          {formError && (
            <div className="text-sm text-red-400 bg-red-950/40 border border-red-800 rounded p-2">
              {formError}
            </div>
          )}
          {/* override controls */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!config.devForceOpen}
              onChange={(e) =>
                dispatch(
                  updateConfigField({
                    field: "devForceOpen",
                    value: e.target.checked,
                  })
                )
              }
            />
            Developer: Force open (override schedules)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!config.forceClosed}
              onChange={(e) =>
                dispatch(
                  updateConfigField({
                    field: "forceClosed",
                    value: e.target.checked,
                  })
                )
              }
            />
            Force closed now
          </label>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Admin alert recipients
            </label>
            <div className="space-y-2">
              {(config.adminAlertEmails || []).map((em, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="email"
                    value={em}
                    onChange={(e) => {
                      const list = [...(config.adminAlertEmails || [])];
                      list[i] = e.target.value;
                      dispatch(
                        updateConfigField({
                          field: "adminAlertEmails",
                          value: list,
                        })
                      );
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const list = [...(config.adminAlertEmails || [])];
                      list.splice(i, 1);
                      dispatch(
                        updateConfigField({
                          field: "adminAlertEmails",
                          value: list,
                        })
                      );
                    }}
                    className="text-xs px-2 py-1 rounded bg-red-700 hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const newList = [...(config.adminAlertEmails || []), ""];
                  dispatch(
                    updateConfigField({
                      field: "adminAlertEmails",
                      value: newList,
                    })
                  );
                }}
                className="text-xs px-2 py-1 rounded bg-sky-700 hover:bg-sky-600"
              >
                Add recipient
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">
                Business Timezone
              </label>
              <div className="w-full bg-slate-800/60 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300">
                <span className="font-mono">{config.timezone}</span>
                <span className="ml-2 text-xs text-slate-400">
                  (Arizona Time - No DST)
                </span>
              </div>
              <p className="text-xs text-slate-800 mt-1">
                All operating hours are evaluated in Arizona timezone.
              </p>
            </div>

            {/* Closed Banner */}
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">
                Closed banner message
              </label>
              <input
                type="text"
                value={config.bannerMessageClosed || ""}
                onChange={(e) =>
                  dispatch(
                    updateConfigField({
                      field: "bannerMessageClosed",
                      value: e.target.value,
                    })
                  )
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm"
              />
            </div>

            {/* ----------------------------------------------------------------
                SPECIAL OPENING WINDOWS - One-time date/time overrides
                ---------------------------------------------------------------- */}
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-1">
                Special open windows
              </label>
              <div className="space-y-2">
                {(config.specialOpenWindows || []).map((w, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 bg-slate-800/40 rounded-lg p-2 border border-slate-700"
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <input
                        type="datetime-local"
                        value={
                          w.start
                            ? new Date(w.start).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) => {
                          const arr = [...(config.specialOpenWindows || [])];
                          const iso = e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "";
                          arr[i] = { ...arr[i], start: iso };
                          dispatch(updateSpecialWindows(arr));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <span>to</span>
                      <input
                        type="datetime-local"
                        value={
                          w.end
                            ? new Date(w.end).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) => {
                          const arr = [...(config.specialOpenWindows || [])];
                          const iso = e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "";
                          arr[i] = { ...arr[i], end: iso };
                          dispatch(updateSpecialWindows(arr));
                        }}
                        className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Note (optional)"
                        value={w.note || ""}
                        onChange={(e) => {
                          const arr = [...(config.specialOpenWindows || [])];
                          arr[i] = { ...arr[i], note: e.target.value };
                          dispatch(updateSpecialWindows(arr));
                        }}
                        className="flex-1 min-w-[160px] bg-slate-900 border border-slate-700 rounded px-2 py-1 text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const arr = [...(config.specialOpenWindows || [])];
                          arr.splice(i, 1);
                          dispatch(updateSpecialWindows(arr));
                        }}
                        className="text-xs px-2 py-1 rounded bg-red-700 hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    {w.start &&
                      w.end &&
                      new Date(w.end) <= new Date(w.start) && (
                        <div className="text-xs text-red-400">
                          End must be after start.
                        </div>
                      )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const newWindows = [
                      ...(config.specialOpenWindows || []),
                      {
                        start: new Date().toISOString(),
                        end: new Date(Date.now() + 3600000).toISOString(),
                      },
                    ];
                    dispatch(updateSpecialWindows(newWindows));
                  }}
                  className="text-xs px-2 py-1 rounded bg-sky-700 hover:bg-sky-600"
                >
                  Add special window
                </button>
              </div>
            </div>
          </div>
          {/* SAVE BUTTON */}
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
