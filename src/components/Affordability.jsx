import { useEffect, useRef, useState } from "react";
import { FiCheck, FiTrendingDown, FiShield, FiPackage } from "react-icons/fi";
import "./Affordability.css";

/**
 * Affordability
 * Stat-driven section showing the brand's price advantage over competitors.
 * Parallax texture background (Unsplash), forest-green scrim, terracotta accent stats.
 */
import picture from '../assets/affordbility.jpg';

const STATS = [
  { value: "40%", label: "More affordable", sub: "than comparable imported brands" },
  { value: "₨0", label: "Hidden costs", sub: "no middlemen markups passed to you" },
  { value: "100%", label: "Same standard", sub: "lab-tested, regardless of price" },
];

const POINTS = [
  { icon: FiTrendingDown, text: "Local formulation and manufacturing cuts import and distribution costs" },
  { icon: FiShield, text: "Same third-party testing standard as premium international brands" },
  { icon: FiPackage, text: "No proprietary blends or inflated packaging — you pay for the formula, not the box" },
];

export default function Affordability() {
  const sectionRef = useRef(null);
  const [offset, setOffset] = useState(0);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const handleScroll = () => {
      if (!sectionRef.current || reducedMotion.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = (rect.top - viewportH) / (viewportH + rect.height);
      setOffset(progress * -40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="afford" aria-labelledby="afford-heading">
      {/* Parallax texture background */}
      <img
        className="afford__bg"
        style={{ transform: `translateY(${offset}px)` }}
        src={picture}
        aria-hidden="true"
      />
      <div className="afford__scrim" aria-hidden="true" />

      <div className="afford__inner">
        <div className="afford__head">
          <span className="afford__eyebrow">Why families choose us</span>
          <h2 id="afford-heading" className="afford__heading">
            Premium nutrition,
            <br />
            without the premium price.
          </h2>
          <p className="afford__lede">
            We built Affection to close the gap between what quality nutrition
            should cost and what the market charges for it. Same testing
            standard, same clinical rigor — a fraction of the price tag.
          </p>
        </div>

        <div className="afford__stats">
          {STATS.map((s) => (
            <div className="afford__stat" key={s.label}>
              <span className="afford__stat-value">{s.value}</span>
              <span className="afford__stat-label">{s.label}</span>
              <span className="afford__stat-sub">{s.sub}</span>
            </div>
          ))}
        </div>

        <ul className="afford__points">
          {POINTS.map((p) => (
            <li className="afford__point" key={p.text}>
              <span className="afford__point-icon">
                <p.icon size={16} />
              </span>
              <span className="afford__point-text">{p.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}