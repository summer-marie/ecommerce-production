import { useEffect, useMemo, useState } from "react";
import { TERMS_LAST_UPDATED, TERMS_LAST_UPDATED_DISPLAY } from "../legal/legalMeta";

/**
 * InstallConsentModal
 * Presents a one-time Terms/Privacy consent specifically for the PWA experience:
 * - When the user initiates an install (beforeinstallprompt) the modal appears first.
 * - When the app is launched in standalone mode (installed PWA), it appears on first run.
 * It is not shown during normal browsing in a regular tab.
 */
const InstallConsentModal = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [requireConsentOnly, setRequireConsentOnly] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // Version of the legal documents. Bump to re-prompt installed users after material changes.
  const legalVersion = useMemo(() => TERMS_LAST_UPDATED, []);
  const LS_KEY = "legalAccepted";

  // Basic mobile detection: checks UA and coarse pointer (touch-first devices)
  const isMobileDevice = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isUA = /Mobi|Android|iPhone|iPad|iPod/i.test(ua);
    const coarse =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches;
    return isUA || coarse;
  };

  const isStandalone = () => {
    // Detect PWA display mode in Chromium-based browsers
    const standaloneMatch =
      window.matchMedia &&
      window.matchMedia("(display-mode: standalone)").matches;
    // Detect iOS Safari standalone mode
    const iosStandalone = window.navigator.standalone === true;
    return Boolean(standaloneMatch || iosStandalone);
  };

  const alreadyAccepted = () => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      return parsed && parsed.version === legalVersion;
    } catch {
      return false;
    }
  };

  useEffect(() => {
  // Mobile-only: if running as an installed app and acceptance for this version is missing, show on first launch
  if (isMobileDevice() && isStandalone() && !alreadyAccepted()) {
      setRequireConsentOnly(true);
      setShow(true);
    }
    // Dependency intentionally omitted to avoid reopening on unrelated state changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Capture the install prompt so consent can be collected before proceeding (mobile only)
    const onBeforeInstall = (e) => {
      const mobile = isMobileDevice();
      if (!mobile) {
        // Do NOT call preventDefault on desktop so browser can decide (avoids console warning)
        return;
      }
      // Intercept on mobile so we can show our consent modal first
      e.preventDefault();
      setDeferredPrompt(e);
      if (!alreadyAccepted()) {
        setRequireConsentOnly(false);
        setShow(true);
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall, { passive: true });
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persistAcceptance = () => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          acceptedAt: new Date().toISOString(),
          version: legalVersion,
        })
      );
    } catch {
      // Ignore storage failures (e.g., private mode); modal will reappear if needed
    }
  };

  const handleAccept = async () => {
    persistAcceptance();

    // If launched from the install flow, resume the prompt and await the user’s choice
    if (deferredPrompt) {
      const prompt = deferredPrompt;
      setDeferredPrompt(null);
      try {
        await prompt.prompt();
        await prompt.userChoice; // outcome available if needed
      } catch {
        // Swallow errors: user dismissed or prompt failed
      }
    }
    setShow(false);
  };

  const handleNotNow = () => {
    // Close without recording acceptance; will reappear on next install attempt or standalone launch
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="border-b border-gray-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900">
            {requireConsentOnly
              ? "Please review and accept"
              : "Before installing OTW Pizza"}
          </h3>
          <p className="mt-1 text-sm text-gray-600">Updated: {TERMS_LAST_UPDATED_DISPLAY}</p>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-700">
            By continuing, you acknowledge that you have read and agree to our{" "}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline hover:text-green-800"
            >
              Terms and Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 underline hover:text-green-800"
            >
              Privacy Policy
            </a>
            .
          </p>

          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span className="text-sm text-gray-700">
              I agree to the Terms and Conditions and Privacy Policy
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-gray-200 p-4">
          <button
            type="button"
            className="rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={handleNotNow}
          >
            Not now
          </button>
          <button
            type="button"
            disabled={!accepted}
            onClick={handleAccept}
            className={`rounded-md px-4 py-2 text-sm text-white ${
              accepted
                ? "bg-green-600 hover:bg-green-700"
                : "bg-green-300 cursor-not-allowed"
            }`}
          >
            {deferredPrompt ? "Accept & Install" : "Accept"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallConsentModal;
