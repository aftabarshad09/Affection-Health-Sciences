import { useEffect, useRef, useState } from "react";
import { FiUser, FiMail, FiMessageSquare, FiArrowRight, FiPhone, FiMapPin } from "react-icons/fi";
import "./Contact.css";

const CONTACT_DETAILS = [
  { label: "Email", value: "hello@affectionhealthsciences.com", icon: FiMail },
  { label: "Phone", value: "+92 300 1234567", icon: FiPhone },
  { label: "Studio", value: "Islamabad, Pakistan", icon: FiMapPin },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const handleScroll = () => {
      if (!sectionRef.current || reducedMotion.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = (rect.top - viewportH) / (viewportH + rect.height);
      setOffset(progress * -50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("idle");
    }
  };

  return (
    <section ref={sectionRef} className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-panel">
        <div className="contact-panel__bg" style={{ transform: `translate3d(0, ${offset}px, 0)` }} aria-hidden="true" />
        <div className="contact-panel__glow" style={{ transform: `translate3d(${offset * 0.3}px, ${offset * 0.5}px, 0)` }} aria-hidden="true" />

        <div className="contact-panel__content">
          <span className="contact-panel__eyebrow">Get in touch</span>
          <h2 id="contact-heading" className="contact-panel__heading">
            Let's talk<br />wellness.
          </h2>
          <p className="contact-panel__lede">
            Questions about a product, a bulk order, or a partnership? Our team replies within one business day.
          </p>

          <ul className="contact-panel__details">
            {CONTACT_DETAILS.map((item) => (
              <li key={item.label} className="contact-panel__detail">
                <span className="contact-panel__detail-icon" aria-hidden="true">
                  <item.icon size={18} />
                </span>
                <span className="contact-panel__detail-text">
                  <span className="contact-panel__detail-label">{item.label}</span>
                  <span className="contact-panel__detail-value">{item.value}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="contact-form-wrap">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-form__row">
            <label className="contact-form__field">
              <span>Full name</span>
              <div className="contact-form__input-wrap">
                <FiUser className="contact-form__icon" aria-hidden="true" />
                <input type="text" name="name" required autoComplete="name" value={form.name} onChange={handleChange} placeholder="Ahmad Raza" />
              </div>
            </label>
          </div>

          <div className="contact-form__row">
            <label className="contact-form__field">
              <span>Email address</span>
              <div className="contact-form__input-wrap">
                <FiMail className="contact-form__icon" aria-hidden="true" />
                <input type="email" name="email" required autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
            </label>
          </div>

          <div className="contact-form__row">
            <label className="contact-form__field">
              <span>Message</span>
              <div className="contact-form__input-wrap contact-form__input-wrap--textarea">
                <FiMessageSquare className="contact-form__icon contact-form__icon--top" aria-hidden="true" />
                <textarea name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell us what you're looking for..." />
              </div>
            </label>
          </div>

          <button type="submit" className="contact-form__submit" disabled={status === "submitting"}>
            <span>
              {status === "submitting" ? "Sending..." : status === "sent" ? "Message sent" : "Send message"}
            </span>
            {status !== "sent" && <FiArrowRight className="contact-form__submit-arrow" aria-hidden="true" />}
          </button>

          {status === "sent" && (
            <p className="contact-form__success" role="status">
              Thanks — we've received your message and will be in touch soon.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}