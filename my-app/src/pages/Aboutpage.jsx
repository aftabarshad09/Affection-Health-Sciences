// WhoWeAre.jsx — About Us page
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../style/Aboutpage.css";
import ContactSection from "../components/contact";
import NewsletterStrip from "../components/Newsletter";

/**
 * AboutPage
 * Multi-section About page. Video hero, parallax image breaks (Unsplash),
 * chronological story timeline, values, science section, leadership, CTA.
 * Orchid kept as a quiet accent — restraint over boldness.
 *
 * SEO: pair with route-level <Helmet> for title/description/og tags.
 */

// Scroll-reveal hook — fades sections in as they enter the viewport
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.18 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

const TIMELINE = [
  { year: "2016", title: "A question, not a product", body: "We started by asking why so many supplements prioritized shelf life over the people taking them. That question became our founding principle." },
  { year: "2019", title: "Our first formulations", body: "After three years of research partnerships, our earliest clinical-grade formulas reached the families who needed them most." },
  { year: "2022", title: "Independent testing, every batch", body: "We committed to third-party lab verification on every single batch — a standard we've never since lowered." },
  { year: "2025", title: "A growing range", body: "Today our formulations span hepatic, maternal, pediatric, and immune support — each built to the same honest standard." },
];

const VALUES = [
  { title: "Evidence first", body: "If the research doesn't support it, it doesn't go in the formula. We let the science set the limit, not the marketing." },
  { title: "Radical transparency", body: "Certificates of analysis available on request, ingredients named in plain terms, nothing hidden behind proprietary blends." },
  { title: "Made for the body", body: "Functional before beautiful. Every choice serves the person taking it, not the shelf it sits on." },
  { title: "Lasting partnerships", body: "We work with clinicians, researchers, and families for the long term — not the transaction." },
];

const LEADERS = [
  { name: "Dr. Sana Mahmood", role: "Chief Formulation Scientist", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80" },
  { name: "Imran Yousaf", role: "Head of Quality & Compliance", img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80" },
  { name: "Dr. Ayesha Khan", role: "Clinical Research Lead", img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=600&q=80" },
];

export default function AboutPage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [missionRef, missionShown] = useReveal();
  const [storyRef, storyShown] = useReveal();
  const [valuesRef, valuesShown] = useReveal();
  const [scienceRef, scienceShown] = useReveal();
  const [teamRef, teamShown] = useReveal();

  return (
    <main className="wwa">
      {/* ---------- HERO (video) ---------- */}
      <section className="wwa-hero">
        <div className="wwa-hero__media" aria-hidden="true">
          <video
            className="wwa-hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80"
          >
            {/* Free stock video (Coverr / Pexels). Swap src if you host your own. */}
            <source
              src="https://videos.pexels.com/video-files/3briefcase/3briefcase.mp4"
              type="video/mp4"
            />
            <source
              src="https://cdn.coverr.co/videos/coverr-leaves-in-the-wind-1080p.mp4"
              type="video/mp4"
            />
          </video>
          <div className="wwa-hero__scrim" />
        </div>

        <div className="wwa-hero__content">
          <span className="wwa-eyebrow wwa-eyebrow--light">Who we are</span>
          <h1 className="wwa-hero__title">
            Wellness, formulated
            <br />
            with intention.
          </h1>
          <p className="wwa-hero__lede">
            We're a research-led nutrition company building products for people
            who read the label — and expect what's on it to be true.
          </p>
        </div>

        <div className="wwa-hero__scroll-hint" aria-hidden="true">
          <span /> Scroll
        </div>
      </section>

      {/* ---------- MISSION ---------- */}
      <section
        ref={missionRef}
        className={`wwa-mission ${missionShown ? "is-shown" : ""}`}
      >
        <div className="wwa-mission__inner">
          <span className="wwa-eyebrow">Our mission</span>
          <p className="wwa-mission__statement">
            To make nutrition you can trust without a second thought — where
            every ingredient earns its place, every batch is proven, and every
            claim is one we'd stake our name on.
          </p>
        </div>
      </section>

      {/* ---------- PARALLAX BREAK 1 ---------- */}
      <div className="wwa-parallax" aria-hidden="true">
        <div
          className="wwa-parallax__img"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80')",
            transform: `translateY(${scrollY * 0.04}px)`,
          }}
        />
        <div className="wwa-parallax__quote">
          <p>"What reaches you is functional first, and beautiful because it's honest."</p>
        </div>
      </div>

      {/* ---------- STORY / TIMELINE ---------- */}
      <section
        ref={storyRef}
        className={`wwa-story ${storyShown ? "is-shown" : ""}`}
      >
        <div className="wwa-story__head">
          <span className="wwa-eyebrow">Our story</span>
          <h2 className="wwa-h2">From a question to a standard</h2>
        </div>

        <ol className="wwa-timeline">
          {TIMELINE.map((item) => (
            <li className="wwa-timeline__item" key={item.year}>
              <span className="wwa-timeline__year">{item.year}</span>
              <div className="wwa-timeline__body">
                <h3 className="wwa-timeline__title">{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- VALUES ---------- */}
      <section
        ref={valuesRef}
        className={`wwa-values ${valuesShown ? "is-shown" : ""}`}
      >
        <div className="wwa-values__head">
          <span className="wwa-eyebrow">What guides us</span>
          <h2 className="wwa-h2">Four principles, no exceptions</h2>
        </div>
        <div className="wwa-values__grid">
          {VALUES.map((v, i) => (
            <article className="wwa-value" key={v.title} style={{ transitionDelay: `${i * 80}ms` }}>
              <h3 className="wwa-value__title">{v.title}</h3>
              <p className="wwa-value__body">{v.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- SCIENCE (split + parallax img) ---------- */}
      <section
        ref={scienceRef}
        className={`wwa-science ${scienceShown ? "is-shown" : ""}`}
      >
        <div className="wwa-science__media">
          <div
            className="wwa-science__img"
            style={{ transform: `translateY(${scrollY * 0.02}px)` }}
            role="img"
            aria-label="Laboratory research"
          />
        </div>
        <div className="wwa-science__copy">
          <span className="wwa-eyebrow">The science</span>
          <h2 className="wwa-h2">Tested before it's trusted</h2>
          <p>
            Every formulation is developed with research partners and verified
            by independent, third-party laboratories — for potency, purity, and
            contaminants — before a single unit ships.
          </p>
          <p>
            We publish what we can, share certificates on request, and never ask
            you to take a claim on faith.
          </p>
          <ul className="wwa-science__list">
            <li>Third-party batch verification</li>
            <li>No artificial fillers or hidden blends</li>
            <li>Clinician-reviewed formulations</li>
          </ul>
        </div>
      </section>

      {/* ---------- LEADERSHIP ---------- */}
      <section
        ref={teamRef}
        className={`wwa-team ${teamShown ? "is-shown" : ""}`}
      >
        <div className="wwa-team__head">
          <span className="wwa-eyebrow">Leadership</span>
          <h2 className="wwa-h2">The people behind the formulas</h2>
        </div>
        <div className="wwa-team__grid">
          {LEADERS.map((p) => (
            <article className="wwa-leader" key={p.name}>
              <div className="wwa-leader__photo">
                <img src={p.img} alt={p.name} loading="lazy" />
              </div>
              <h3 className="wwa-leader__name">{p.name}</h3>
              <p className="wwa-leader__role">{p.role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="wwa-cta">
        <div className="wwa-cta__inner">
          <h2 className="wwa-cta__title">Built for people who ask questions.</h2>
          <p className="wwa-cta__lede">
            Explore the range, or reach out — we're happy to talk formulation,
            sourcing, and everything in between.
          </p>
          <div className="wwa-cta__actions">
            <Link to="/products" className="wwa-btn wwa-btn--solid">
              Explore products
            </Link>
            <Link to="/contact" className="wwa-btn wwa-btn--ghost">
              Get in touch
            </Link>
          </div>
        </div>
      </section>
      <ContactSection />
      <NewsletterStrip />
    </main>
  );
}