import { useCallback, useEffect, useRef, useState } from "react";
import { FiShield, FiCheck, FiX, FiSettings, FiArrowLeft } from "react-icons/fi";
import { getStoredConsent, persistConsent } from "../utils/cookieConsent";
import "./CookieConsent.css";

const CATEGORIES = [
  {
    key: "necessary",
    label: "Necessary",
    description: "Required for core site features like navigation and security. Always active.",
    locked: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description: "Helps us understand how visitors use the site so we can improve it.",
  },
  {
    key: "marketing",
    label: "Marketing",
    description: "Used to show relevant offers and measure campaign performance.",
  },
];

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [prefs, setPrefs] = useState({ analytics: false, marketing: false });
  const modalRef = useRef(null);

  useEffect(() => {
    if (getStoredConsent()) return;
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!customizing) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setCustomizing(false);
    };
    document.addEventListener("keydown", onKeyDown);
    modalRef.current?.querySelector("button, input")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [customizing]);

  const finalize = useCallback((nextPrefs) => {
    persistConsent(nextPrefs);
    setVisible(false);
    setCustomizing(false);
  }, []);

  if (!visible) return null;

  const toggleCategory = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <div className="cc-banner" role="region" aria-label="Cookie consent">
        <div className="cc-banner__icon" aria-hidden="true">
          <FiShield size={20} />
        </div>
        <p className="cc-banner__text">
          We use cookies to run this site, understand how it's used, and improve your
          experience. See our <a href="/privacy">Privacy Policy</a> for details.
        </p>
        <div className="cc-banner__actions">
          <button type="button" className="cc-btn cc-btn--ghost glass-btn" onClick={() => finalize({ analytics: false, marketing: false })}>
            <FiX size={14} /> Reject
          </button>
          <button type="button" className="cc-btn cc-btn--outline glass-btn" onClick={() => setCustomizing(true)}>
            <FiSettings size={14} /> Customize
          </button>
          <button type="button" className="cc-btn cc-btn--primary glass-btn" onClick={() => finalize({ analytics: true, marketing: true })}>
            <FiCheck size={14} /> Accept All
          </button>
        </div>
      </div>

      {customizing && (
        <div
          className="cc-modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setCustomizing(false);
          }}
        >
          <div
            className="cc-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cc-modal-title"
            ref={modalRef}
          >
            <div className="cc-modal__header">
              <button
                type="button"
                className="cc-modal__back"
                onClick={() => setCustomizing(false)}
                aria-label="Back to cookie notice"
              >
                <FiArrowLeft size={18} />
              </button>
              <h2 id="cc-modal-title" className="cc-modal__title">Cookie preferences</h2>
            </div>

            <p className="cc-modal__lede">
              Choose which categories of cookies you're comfortable with. You can change
              this at any time from the link in our site footer.
            </p>

            <div className="cc-modal__list">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="cc-category">
                  <div className="cc-category__text">
                    <span className="cc-category__label">
                      {cat.label}
                      {cat.locked && <span className="cc-category__badge">Always on</span>}
                    </span>
                    <span className="cc-category__desc">{cat.description}</span>
                  </div>
                  <label className={`cc-toggle ${cat.locked ? "cc-toggle--locked" : ""}`}>
                    <input
                      type="checkbox"
                      checked={cat.locked ? true : !!prefs[cat.key]}
                      disabled={cat.locked}
                      onChange={() => !cat.locked && toggleCategory(cat.key)}
                      aria-label={`Toggle ${cat.label} cookies`}
                    />
                    <span className="cc-toggle__track">
                      <span className="cc-toggle__thumb" />
                    </span>
                  </label>
                </div>
              ))}
            </div>

            <div className="cc-modal__footer">
              <button type="button" className="cc-btn cc-btn--ghost glass-btn" onClick={() => finalize({ analytics: false, marketing: false })}>
                Reject all
              </button>
              <button type="button" className="cc-btn cc-btn--outline glass-btn" onClick={() => finalize(prefs)}>
                Save preferences
              </button>
              <button type="button" className="cc-btn cc-btn--primary glass-btn" onClick={() => finalize({ analytics: true, marketing: true })}>
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
