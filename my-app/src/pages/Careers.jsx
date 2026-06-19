// Careers.jsx — Careers page
import { useEffect, useRef, useState } from "react";
import "../style/Careers.css";
import NewsletterStrip from "../components/Newsletter";
import ContactSection from "../components/contact";

/**
 * Careers
 * Multi-section careers page. Video hero, parallax break, why-work-here,
 * open medical-rep roles with full job descriptions, and a white/black
 * application form. No pink anywhere on this page — strictly ink/white/gray.
 */

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.16 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

const PERKS = [
  { title: "Field autonomy", body: "Own your territory and your relationships. We hire people we trust to make the right call in the room." },
  { title: "Clinical depth", body: "Sell products you can stand behind — every formulation is third-party tested and clinician-reviewed." },
  { title: "Real progression", body: "Clear paths from field rep to regional and national roles, with mentorship that isn't just a line in a handbook." },
  { title: "Health-first culture", body: "We make wellness products; we'd be hypocrites not to live it. Flexible hours and genuine support." },
];

const ROLES = [
  {
    id: "msr-lhr",
    title: "Medical Sales Representative",
    location: "Lahore, Pakistan",
    type: "Full-time · Field-based",
    summary:
      "Represent our hepatic and maternal nutrition range to hospitals, clinics, and pharmacies across the Lahore region.",
    responsibilities: [
      "Build and maintain relationships with physicians, pharmacists, and hospital procurement teams",
      "Deliver clinically accurate product detailing to healthcare professionals",
      "Achieve territory sales targets while maintaining compliance with medical marketing standards",
      "Gather field intelligence on prescribing patterns and competitor activity",
    ],
    requirements: [
      "Bachelor's in Pharmacy, Life Sciences, or related field",
      "1–3 years medical/pharmaceutical sales experience preferred",
      "Strong communication and relationship-building skills",
      "Valid driving licence and willingness to travel within territory",
    ],
  },
  {
    id: "ksr-isb",
    title: "Key Accounts Specialist",
    location: "Islamabad, Pakistan",
    type: "Full-time · Hybrid",
    summary:
      "Manage strategic hospital and distributor accounts for our pediatric and immune-support product lines.",
    responsibilities: [
      "Own relationships with major hospital and pharmacy chain accounts",
      "Negotiate supply agreements and coordinate with the compliance team",
      "Lead product training sessions for partner clinical staff",
      "Forecast demand and coordinate with operations on fulfilment",
    ],
    requirements: [
      "Bachelor's degree in a health, business, or science discipline",
      "3+ years in pharmaceutical key-account or B2B medical sales",
      "Proven negotiation and account-management track record",
      "Comfortable with CRM tools and structured reporting",
    ],
  },
  {
    id: "rm-north",
    title: "Regional Sales Manager — North",
    location: "Islamabad / Rawalpindi",
    type: "Full-time · Leadership",
    summary:
      "Lead and grow a team of medical representatives across the northern region, owning targets and team development.",
    responsibilities: [
      "Recruit, coach, and manage a team of field representatives",
      "Set and track regional sales targets across product lines",
      "Partner with marketing on territory-level campaigns and launches",
      "Ensure full compliance with medical marketing regulations across the team",
    ],
    requirements: [
      "Bachelor's or Master's in a relevant discipline",
      "5+ years pharmaceutical sales, including 2+ in team leadership",
      "Strong analytical and people-management skills",
      "Track record of hitting regional targets in a medical context",
    ],
  },
];

export default function Careers() {
  const [scrollY, setScrollY] = useState(0);
  const [openRole, setOpenRole] = useState(ROLES[0].id);
  const [appliedRole, setAppliedRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    experience: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [perksRef, perksShown] = useReveal();
  const [rolesRef, rolesShown] = useReveal();
  const [formRef, formShown] = useReveal();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus("done");
      setForm({ name: "", email: "", phone: "", role: "", experience: "", message: "" });
    } catch (err) {
      setStatus("idle");
    }
  };

  const applyToRole = (role) => {
    setForm((p) => ({ ...p, role: role.title }));
    setAppliedRole(role.title);
    document.getElementById("apply")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="careers">
      {/* ---------- HERO (video) ---------- */}
      <section className="careers-hero">
        <div className="careers-hero__media" aria-hidden="true">
          <video
            className="careers-hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80"
          >
            <source
              src="https://cdn.coverr.co/videos/coverr-a-team-meeting-in-an-office-1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="careers-hero__scrim" />
        </div>

        <div className="careers-hero__content">
          <span className="careers-eyebrow careers-eyebrow--light">Careers</span>
          <h1 className="careers-hero__title">
            Represent products
            <br />
            worth standing behind.
          </h1>
          <p className="careers-hero__lede">
            We're hiring medical sales professionals who'd rather detail a
            formula they trust than push one they don't. If that's you, read on.
          </p>
          <a href="#openings" className="careers-hero__cta">
            View open roles
          </a>
        </div>
      </section>

      {/* ---------- WHY WORK HERE ---------- */}
      <section
        ref={perksRef}
        className={`careers-perks ${perksShown ? "is-shown" : ""}`}
      >
        <div className="careers-perks__head">
          <span className="careers-eyebrow">Why join us</span>
          <h2 className="careers-h2">A medical sales role that respects you</h2>
        </div>
        <div className="careers-perks__grid">
          {PERKS.map((p) => (
            <article className="careers-perk" key={p.title}>
              <h3 className="careers-perk__title">{p.title}</h3>
              <p className="careers-perk__body">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- PARALLAX BREAK ---------- */}
      <div className="careers-parallax" aria-hidden="true">
        <div
          className="careers-parallax__img"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1600&q=80')",
            transform: `translateY(${scrollY * 0.04}px)`,
          }}
        />
        <div className="careers-parallax__quote">
          <p>"The best representatives don't sell. They inform, and the trust does the rest."</p>
        </div>
      </div>

      {/* ---------- OPEN ROLES ---------- */}
      <section
        id="openings"
        ref={rolesRef}
        className={`careers-roles ${rolesShown ? "is-shown" : ""}`}
      >
        <div className="careers-roles__head">
          <span className="careers-eyebrow">Open positions</span>
          <h2 className="careers-h2">Current openings</h2>
          <p className="careers-roles__intro">
            Medical and field-sales roles across Pakistan. Expand a role to read
            the full description, then apply below.
          </p>
        </div>

        <div className="careers-roles__list">
          {ROLES.map((role) => {
            const isOpen = openRole === role.id;
            return (
              <article className={`careers-role ${isOpen ? "is-open" : ""}`} key={role.id}>
                <button
                  type="button"
                  className="careers-role__bar"
                  aria-expanded={isOpen}
                  aria-controls={`role-${role.id}`}
                  onClick={() => setOpenRole(isOpen ? "" : role.id)}
                >
                  <div className="careers-role__bar-main">
                    <h3 className="careers-role__title">{role.title}</h3>
                    <div className="careers-role__meta">
                      <span>{role.location}</span>
                      <span className="careers-role__dot" aria-hidden="true">·</span>
                      <span>{role.type}</span>
                    </div>
                  </div>
                  <span className="careers-role__toggle" aria-hidden="true">
                    {isOpen ? "–" : "+"}
                  </span>
                </button>

                <div
                  id={`role-${role.id}`}
                  className="careers-role__panel"
                  style={{ maxHeight: isOpen ? "1200px" : "0px" }}
                >
                  <div className="careers-role__panel-inner">
                    <p className="careers-role__summary">{role.summary}</p>

                    <div className="careers-role__cols">
                      <div>
                        <h4 className="careers-role__subhead">Responsibilities</h4>
                        <ul>
                          {role.responsibilities.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="careers-role__subhead">Requirements</h4>
                        <ul>
                          {role.requirements.map((r) => (
                            <li key={r}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="careers-role__apply"
                      onClick={() => applyToRole(role)}
                    >
                      Apply for this role
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ---------- APPLICATION FORM ---------- */}
      <section
        id="apply"
        ref={formRef}
        className={`careers-apply ${formShown ? "is-shown" : ""}`}
      >
        <div className="careers-apply__inner">
          <div className="careers-apply__head">
            <span className="careers-eyebrow">Application</span>
            <h2 className="careers-h2">Apply now</h2>
            <p className="careers-apply__intro">
              {appliedRole
                ? `You're applying for: ${appliedRole}. Fill in your details and our team will be in touch.`
                : "Tell us a little about yourself and the role you're interested in. We review every application."}
            </p>
          </div>

          <form className="careers-form" onSubmit={handleSubmit} noValidate>
            <div className="careers-form__grid">
              <label className="careers-field">
                <span>Full name</span>
                <input type="text" name="name" required autoComplete="name" value={form.name} onChange={handleChange} placeholder="Your name" />
              </label>

              <label className="careers-field">
                <span>Email</span>
                <input type="email" name="email" required autoComplete="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
              </label>

              <label className="careers-field">
                <span>Phone</span>
                <input type="tel" name="phone" autoComplete="tel" value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" />
              </label>

              <label className="careers-field">
                <span>Role applying for</span>
                <select name="role" value={form.role} onChange={handleChange} required>
                  <option value="" disabled>Select a role</option>
                  {ROLES.map((r) => (
                    <option key={r.id} value={r.title}>{r.title}</option>
                  ))}
                </select>
              </label>

              <label className="careers-field careers-field--full">
                <span>Years of relevant experience</span>
                <input type="text" name="experience" value={form.experience} onChange={handleChange} placeholder="e.g. 3 years in pharmaceutical sales" />
              </label>

              <label className="careers-field careers-field--full">
                <span>Why are you a fit?</span>
                <textarea name="message" rows={5} value={form.message} onChange={handleChange} placeholder="A few lines about your experience and why this role interests you..." />
              </label>
            </div>

            <button type="submit" className="careers-form__submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Submitting..." : status === "done" ? "Application sent" : "Submit application"}
            </button>

            {status === "done" && (
              <p className="careers-form__success" role="status">
                Thank you — your application has been received. We'll be in touch if there's a fit.
              </p>
            )}

            <p className="careers-form__note">
              Note: this form posts to a placeholder endpoint. Attach CV upload handling on your Node backend.
            </p>
          </form>
        </div>
      </section>
      <ContactSection  />
      <NewsletterStrip  />
    </main>
  );
}