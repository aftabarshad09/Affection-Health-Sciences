import React from "react";
import "./Logostrip.css";
import logo1 from "../assets/logos/001.png";
import logo2 from "../assets/logos/002.png";
import logo3 from "../assets/logos/003.png";
import logo4 from "../assets/logos/004.jpeg";

const LOGOS = [
  { id: 1, src: logo1, alt: "Partner logo 1" },
  { id: 2, src: logo2, alt: "Partner logo 2" },
  { id: 3, src: logo3, alt: "Partner logo 3" },
  { id: 4, src: logo4, alt: "Partner logo 4" },
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