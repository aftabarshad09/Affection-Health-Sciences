import { useEffect, useRef, useState } from "react";
import "./About.css";

const STATS = [
  { value: "20+", label: "Formulated products" },
  { value: "100%", label: "Lab-tested batches" },
  { value: "0", label: "Artificial fillers" },
];

export default function About({ onExplore }) {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const [inView, setInView] = useState(false);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleScroll = () => {
      if (!sectionRef.current || prefersReducedMotion.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = (rect.top - viewportH) / (viewportH + rect.height);
      setOffset(progress * -60);
    };

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="about-teaser" aria-labelledby="about-teaser-heading">
      <div className="about-teaser__scene" aria-hidden="true">
        <div className="about-teaser__petal about-teaser__petal--one" style={{ transform: `translate3d(0, ${offset * 0.6}px, 0)` }} />
        <div className="about-teaser__petal about-teaser__petal--two" style={{ transform: `translate3d(0, ${offset}px, 0)` }} />
        <div className="about-teaser__petal about-teaser__petal--three" style={{ transform: `translate3d(0, ${offset * 0.35}px, 0)` }} />
        <svg className="about-teaser__ring" style={{ transform: `translate3d(0, ${offset * 0.2}px, 0) rotate(${offset * 0.15}deg)` }} viewBox="0 0 400 400" fill="none">
          <circle cx="200" cy="200" r="180" stroke="#d99fdb" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx="200" cy="200" r="140" stroke="#d99fdb" strokeWidth="1" strokeOpacity="0.25" />
        </svg>
      </div>

      <div className={`about-teaser__inner ${inView ? "is-visible" : ""}`}>
        <div className="about-teaser__copy">
          <span className="about-teaser__eyebrow">Affection Health Sciences</span>

          <h2 id="about-teaser-heading" className="about-teaser__heading">
            Wellness, formulated<br />
            with <em>intention</em>.
          </h2>

          <p className="about-teaser__lede">
            Every product we make starts with a question: does this genuinely
            serve the body, or just the shelf? We research, source, and test
            with that single standard — so what reaches you is functional
            first, and beautiful because it's honest.
          </p>

          <button type="button" className="about-teaser__cta" onClick={onExplore}>
            <span>Explore who we are</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M4 9H14M14 9L9.5 4.5M14 9L9.5 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="about-teaser__stats" role="list">
          {STATS.map((stat) => (
            <div className="about-teaser__stat" role="listitem" key={stat.label}>
              <span className="about-teaser__stat-value">{stat.value}</span>
              <span className="about-teaser__stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}