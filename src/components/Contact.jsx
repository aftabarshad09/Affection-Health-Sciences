import { useEffect, useRef, useState } from "react";
import { FiUser, FiMail, FiMessageSquare, FiArrowRight, FiPhone, FiMapPin, FiTag } from "react-icons/fi";
import "./Contact.css";

const CONTACT_DETAILS = [
  { label: "Email", value: "info@affectionhealthsciences.com", href: "mailto:info@affectionhealthsciences.com", icon: FiMail },
  { label: "Phone", value: "+92 331 9845081", href: "https://wa.me/923319845081", icon: FiPhone },
  { label: "Studio", value: "B109 Satellite Town, Rawalpindi, Pakistan", icon: FiMapPin },
];

export default function ContactSection() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [status, setStatus] = useState("idle");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    subject: "",
    message: "",
  });
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send message");
      setStatus("sent");
      setForm({ firstName: "", lastName: "", email: "", contact: "", subject: "", message: "" });
    } catch {
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
                  {item.href ? (
                    <a
                      className="contact-panel__detail-value"
                      href={item.href}
                      target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="contact-panel__detail-value">{item.value}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="contact-form-wrap">
        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <div className="contact-form__row contact-form__row--split">
            <label className="contact-form__field">
              <span>First name</span>
              <div className="contact-form__input-wrap">
                <FiUser className="contact-form__icon" aria-hidden="true" />
                <input type="text" name="firstName" required autoComplete="given-name" value={form.firstName} onChange={handleChange} placeholder="Ahmad" />
              </div>
            </label>

            <label className="contact-form__field">
              <span>Last name</span>
              <div className="contact-form__input-wrap">
                <FiUser className="contact-form__icon" aria-hidden="true" />
                <input type="text" name="lastName" required autoComplete="family-name" value={form.lastName} onChange={handleChange} placeholder="Raza" />
              </div>
            </label>
          </div>

          <div className="contact-form__row contact-form__row--split">
            <label className="contact-form__field">
              <span>Email address</span>
              <div className="contact-form__input-wrap">
                <FiMail className="contact-form__icon" aria-hidden="true" />
                <input type="email" name="email" required autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </div>
            </label>

            <label className="contact-form__field">
              <span>Contact number</span>
              <div className="contact-form__input-wrap">
                <FiPhone className="contact-form__icon" aria-hidden="true" />
                <input type="tel" name="contact" required autoComplete="tel" value={form.contact} onChange={handleChange} placeholder="+92 300 1234567" />
              </div>
            </label>
          </div>

          <div className="contact-form__row">
            <label className="contact-form__field">
              <span>Subject</span>
              <div className="contact-form__input-wrap">
                <FiTag className="contact-form__icon" aria-hidden="true" />
                <input type="text" name="subject" required value={form.subject} onChange={handleChange} placeholder="How can we help?" />
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

          <button type="submit" className="contact-form__submit glass-btn" disabled={status === "submitting"}>
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