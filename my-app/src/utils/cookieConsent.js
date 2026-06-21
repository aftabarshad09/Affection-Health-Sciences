const STORAGE_KEY = "ahs_cookie_consent";
const CONSENT_VERSION = 1;

/** Reads the stored consent record, or null if none exists (or it's stale/corrupt). */
export function getStoredConsent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.version !== CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Convenience check other parts of the app can use before loading a tracking/marketing script. */
export function hasConsent(category) {
  if (category === "necessary") return true;
  return !!getStoredConsent()?.[category];
}

/** Persists the user's choice and notifies the rest of the app. */
export function persistConsent(prefs) {
  const payload = {
    version: CONSENT_VERSION,
    necessary: true,
    analytics: !!prefs.analytics,
    marketing: !!prefs.marketing,
    consentDate: new Date().toISOString(),
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage unavailable (private browsing, full quota, etc.) — consent
    // simply won't persist across visits; the banner will just reappear.
  }
  window.dispatchEvent(new CustomEvent("ahs:cookie-consent-updated", { detail: payload }));
  return payload;
}
