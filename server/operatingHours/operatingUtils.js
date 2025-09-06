import { DateTime } from "luxon";

// Parse HH:mm in tz to DateTime on given day
function parseTime(tz, date, hm) {
  const [h, m] = (hm || "").split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return DateTime.fromObject(
    { year: date.year, month: date.month, day: date.day, hour: h, minute: m },
    { zone: tz }
  );
}

export function computeOpenStatus(doc, nowUTC = DateTime.utc()) {
  if (!doc) return { isOpen: true, reason: "no_doc" };
  const tz = doc.timezone || "UTC";
  const now = nowUTC.setZone(tz);

  // Developer override: force open regardless of schedule
  if (doc.devForceOpen) return { isOpen: true, reason: "devForceOpen" };

  if (doc.forceClosed) return { isOpen: false, reason: "forceClosed" };

  // Special windows (absolute)
  for (const win of doc.specialOpenWindows || []) {
    const start = DateTime.fromJSDate(new Date(win.start)).setZone(tz);
    const end = DateTime.fromJSDate(new Date(win.end)).setZone(tz);
    if (start <= now && now <= end) {
      return { isOpen: true, reason: "specialWindow" };
    }
  }

  // Weekly windows relative to current weekday
  const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const dayKey = weekdays[now.weekday % 7]; // luxon: Mon=1..Sun=7
  const windows = doc.weeklyHours?.[dayKey] || [];
  for (const w of windows) {
    const start = parseTime(tz, now, w.start);
    const end = parseTime(tz, now, w.end);
    if (start && end && start <= now && now <= end) {
      return { isOpen: true, reason: "weeklyWindow" };
    }
  }
  return { isOpen: false, reason: "outsideHours" };
}
