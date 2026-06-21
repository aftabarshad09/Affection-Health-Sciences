import React from "react";
import "./LogoStrip.css";

const LOGO_BASE = "/src/assets/logos/";

const LOGOS = [
  { id: 1, src: `${LOGO_BASE}001.png`, alt: "Partner logo 1" },
  { id: 2, src: `${LOGO_BASE}002.png`, alt: "Partner logo 2" },
  { id: 3, src: `${LOGO_BASE}003.png`, alt: "Partner logo 3" },
  { id: 4, src: `${LOGO_BASE}004.jpeg`, alt: "Partner logo 4" },
];

export default function LogoStrip() {
  // Repeat 4x to ensure seamless loop at all screen sizes
  const track = [...LOGOS, ...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <div className="logostrip">
      <div className="logostrip__inner">
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
    </div>
  );
}