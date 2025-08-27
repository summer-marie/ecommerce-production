import { useEffect, useState } from "react";
import { Link } from "react-router";

// Mobile-only sticky consent banner for Terms & Privacy acceptance.
// Stores acceptance in localStorage (key: legalConsentAccepted) and hides after accepted.
const MobileLegalConsent = () => {
  const [accepted, setAccepted] = useState(true); // assume accepted until we check storage
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const val = localStorage.getItem("legalConsentAccepted");
      setAccepted(!!val);
    } catch {
      // if storage fails, don't block the UI
      setAccepted(true);
    }
  }, []);

  if (accepted) return null;

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-50">
      <div className="m-4 rounded-xl border border-gray-200 bg-white shadow-xl p-4">
        <p className="text-sm text-gray-700">
          By using OTW Pizza on your phone, you agree to our {" "}
          <Link to="/terms" className="text-blue-600 hover:underline">Terms</Link> {" "}
          and {" "}
          <Link to="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            I have read and agree
          </label>
          <button
            type="button"
            disabled={!checked}
            onClick={() => {
              try {
                localStorage.setItem("legalConsentAccepted", new Date().toISOString());
              } catch {
                // ignore storage errors and proceed so the banner can close
              }
              setAccepted(true);
            }}
            className={`${
              checked ? "bg-green-600 hover:bg-green-700" : "bg-gray-300 cursor-not-allowed"
            } text-white px-4 py-2 rounded-lg text-sm font-medium transition`}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLegalConsent;
