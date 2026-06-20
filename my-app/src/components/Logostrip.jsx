import React from "react";
import "./LogoStrip.css";

/* ============================================================
   LOGOS
   Path: src/assets/logos/
   Add/remove entries here — the strip duplicates this list
   automatically to create the seamless infinite scroll, so you
   don't need to repeat anything yourself.
   ============================================================ */
const LOGO_BASE = "/src/assets/logos/";

const LOGOS = [
  { id: 1, src: `${LOGO_BASE}001.png`, alt: "Partner logo 1" },
  { id: 2, src: `${LOGO_BASE}002.png`, alt: "Partner logo 2" },
  { id: 3, src: `${LOGO_BASE}003.png`, alt: "Partner logo 3" },
  { id: 4, src: `${LOGO_BASE}004.png`, alt: "Partner logo 4" },
];

export default function LogoStrip() {
  // Render the set twice back-to-back so the CSS animation can
  // scroll exactly one set-width and loop without a visible seam.
  const track = [...LOGOS, ...LOGOS];

  return (
    <div className="logostrip">
      <div className="logostrip__fade logostrip__fade--left" />
      <div className="logostrip__fade logostrip__fade--right" />
      <div className="logostrip__track">
        {track.map((logo, i) => (
          <div className="logostrip__item" key={`${logo.id}-${i}`}>
            <img
              src={logo.src}
              alt={logo.alt}
              className="logostrip__img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}