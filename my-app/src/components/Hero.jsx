import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "./Hero.css";

import P1 from "../assets/Products/P1.png";
import P2 from "../assets/Products/P24.1.png";
import P3 from "../assets/Products/P5.png";
import P4 from "../assets/Products/P6.png";
import P5 from "../assets/Products/P8.png";
import P6 from "../assets/Products/P3.png";
import P7 from "../assets/Products/P21.png";
import P8 from "../assets/Products/P20.png";
import P9 from "../assets/Products/P8.png";

const products = [
  { image: P1, name: "Protein" },
  { image: P2, name: "BCAA" },
  { image: P3, name: "Energid" },
  { image: P4, name: "Collagen" },
  { image: P5, name: "Immunity+" },
  { image: P6, name: "Omega 3" },
  { image: P7, name: "Multivitamin" },
  { image: P8, name: "Creatine" },
  { image: P9, name: "Wellness Blend" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prev = current === 0 ? products.length - 1 : current - 1;
  const next = current === products.length - 1 ? 0 : current + 1;

  const goToSlide = (index) => {
    setCurrent(index);
  };

  return (
    <section className="hero-section">
      {/* Blur Spots */}
      <div className="blob-spot blob-spot-1"></div>
      <div className="blob-spot blob-spot-2"></div>

      <div className="hero-container">
        <div className="hero-grid">
          {/* LEFT SIDE */}
          <div className="hero-left">
            <div className="hero-badge">Affection Health Sciences</div>

            <h1 className="hero-title">
              Science-Backed
              <span className="hero-title-green">Wellness For</span>
              Everyday Vitality
            </h1>

            <p className="hero-description">
              Carefully formulated supplements designed to
              support energy, recovery, immunity, and overall
              well-being through premium ingredients and
              research-driven nutrition.
            </p>

            <div className="hero-actions">
              <button className="hero-button">Explore Our Products</button>

              <div className="hero-social">
                <a
                  href="https://www.instagram.com/affectionhealth_sciences?igsh=MXkxMWUyanlhd3BiNg%3D%3D&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <FaInstagram className="social-icon" size={16} />
                </a>
                <a
                  href="https://www.facebook.com/share/1A8zXHbfSK/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebookF className="social-icon" size={16} />
                </a>
                <a
                  href="https://www.linkedin.com/company/affection-healtb-sciences/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn className="social-icon" size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - CAROUSEL */}
          <div className="hero-right">
            <div className="carousel-wrapper">
              <div className="carousel-perspective">
                {/* LEFT PRODUCT */}
                <motion.img
                  src={products[prev].image}
                  alt=""
                  className="carousel-left"
                  animate={{
                    x: -160,
                    scale: 0.65,
                    rotateY: 40,
                    opacity: 0.3,
                  }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                />

                {/* ACTIVE PRODUCT */}
                <motion.img
                  key={current}
                  src={products[current].image}
                  alt={products[current].name}
                  className="carousel-active"
                  initial={{ 
                    opacity: 0, 
                    scale: 0.85,
                    rotateY: 15
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    y: [0, -6, 0],
                  }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    y: { repeat: Infinity, duration: 4, ease: "easeInOut" }
                  }}
                />

                {/* RIGHT PRODUCT */}
                <motion.img
                  src={products[next].image}
                  alt=""
                  className="carousel-right"
                  animate={{
                    x: 160,
                    scale: 0.65,
                    rotateY: -40,
                    opacity: 0.3,
                  }}
                  transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                />
              </div>

              {/* PRODUCT NAME */}
              <div className="carousel-name">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={products[current].name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="product-name"
                  >
                    {products[current].name}
                  </motion.h3>
                </AnimatePresence>
              </div>

              {/* DOTS INDICATOR */}
              <div className="carousel-dots">
                {products.map((_, index) => (
                  <button
                    key={index}
                    className={`dot ${index === current ? "dot-active" : "dot-inactive"}`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WAVE ANIMATION */}
      <div className="wave-container">
        <svg
          className="waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 160"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="waveBlur1">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <filter id="waveBlur2">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="waveBlur3">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="waveBlur4">
              <feGaussianBlur stdDeviation="5" />
            </filter>
            
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#C97B5C', stopOpacity: 0 }} />
              <stop offset="15%" style={{ stopColor: '#C97B5C', stopOpacity: 0.2 }} />
              <stop offset="50%" style={{ stopColor: '#C97B5C', stopOpacity: 0.45 }} />
              <stop offset="85%" style={{ stopColor: '#C97B5C', stopOpacity: 0.2 }} />
              <stop offset="100%" style={{ stopColor: '#C97B5C', stopOpacity: 0 }} />
            </linearGradient>
            
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#C97B5C', stopOpacity: 0 }} />
              <stop offset="20%" style={{ stopColor: '#C97B5C', stopOpacity: 0.25 }} />
              <stop offset="50%" style={{ stopColor: '#C97B5C', stopOpacity: 0.55 }} />
              <stop offset="80%" style={{ stopColor: '#C97B5C', stopOpacity: 0.25 }} />
              <stop offset="100%" style={{ stopColor: '#C97B5C', stopOpacity: 0 }} />
            </linearGradient>
            
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#C97B5C', stopOpacity: 0 }} />
              <stop offset="10%" style={{ stopColor: '#C97B5C', stopOpacity: 0.15 }} />
              <stop offset="50%" style={{ stopColor: '#C97B5C', stopOpacity: 0.35 }} />
              <stop offset="90%" style={{ stopColor: '#C97B5C', stopOpacity: 0.15 }} />
              <stop offset="100%" style={{ stopColor: '#C97B5C', stopOpacity: 0 }} />
            </linearGradient>
          </defs>

          {/* Layer 1 - Deep wave */}
          <path
            className="wave wave1"
            d="M0,80 C180,35 360,105 540,60 C720,15 900,90 1080,50 C1260,10 1380,70 1440,50 L1440,160 L0,160 Z"
            fill="url(#waveGradient1)"
            filter="url(#waveBlur1)"
            style={{ mixBlendMode: 'normal' }}
          />

          {/* Layer 2 - Medium wave */}
          <path
            className="wave wave2"
            d="M0,95 C240,50 480,115 720,70 C960,25 1200,95 1440,60 L1440,160 L0,160 Z"
            fill="url(#waveGradient2)"
            filter="url(#waveBlur2)"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Layer 3 - Light wave */}
          <path
            className="wave wave3"
            d="M0,115 C300,70 600,135 900,90 C1200,45 1350,110 1440,80 L1440,160 L0,160 Z"
            fill="url(#waveGradient3)"
            filter="url(#waveBlur3)"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Layer 4 - Subtle glow wave */}
          <path
            className="wave wave4"
            d="M0,130 C200,95 400,145 600,115 C800,85 1000,135 1200,105 C1320,90 1380,120 1440,100 L1440,160 L0,160 Z"
            fill="url(#waveGradient1)"
            filter="url(#waveBlur4)"
            opacity="0.35"
            style={{ mixBlendMode: 'soft-light' }}
          />

          {/* Layer 5 - Floating ribbon */}
          <path
            className="wave wave5"
            d="M0,120 C180,75 360,130 540,95 C720,60 900,115 1080,80 C1260,45 1380,85 1440,65 L1440,160 L0,160 Z"
            fill="url(#waveGradient2)"
            filter="url(#waveBlur2)"
            opacity="0.25"
            style={{ mixBlendMode: 'overlay' }}
          />
        </svg>
        
        {/* Shine overlay on waves */}
        <div className="wave-shine"></div>
      </div>
    </section>
  );
}