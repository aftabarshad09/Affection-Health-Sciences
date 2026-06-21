import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  { image: P1, name: "GYNOgID" },
  { image: P2, name: "INFANTIN LF" },
  { image: P3, name: "ENERGID PLUS" },
  { image: P4, name: "BEST PROTIEN" },
  { image: P5, name: "HIPATOVITAL" },
  { image: P6, name: "GLUMIN SR" },
  { image: P7, name: "INFANTIN PRE" },
  { image: P8, name: "INFANTIN AR" },
  { image: P9, name: "HIPATOVITAL" },
];

// Typewriter hook: types text out, holds, then deletes (used for product name)
function useTypewriter(text, { typeSpeed = 70, deleteSpeed = 35, holdTime = 1100 } = {}) {
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // "typing" | "holding" | "deleting"

  useEffect(() => {
    setDisplayed("");
    setPhase("typing");
  }, [text]);

  useEffect(() => {
    let timeout;

    if (phase === "typing") {
      if (displayed.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length + 1));
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase("holding"), holdTime);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(text.slice(0, displayed.length - 1));
        }, deleteSpeed);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, text, typeSpeed, deleteSpeed, holdTime]);

  return displayed;
}

// Cycling typewriter: types each statement (line1 + line2) in the array, holds, deletes, then moves to the next — loops forever
function useCyclingTypewriter(statements, { typeSpeed = 45, deleteSpeed = 25, holdTime = 1600, pauseBeforeNext = 400 } = {}) {
  const [statementIndex, setStatementIndex] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState("typing"); // "typing" | "holding" | "deleting" | "pausing"

  const current = statements[statementIndex];
  const fullText = current.line1 + " " + current.line2;

  useEffect(() => {
    let timeout;

    if (phase === "typing") {
      if (displayed.length < fullText.length) {
        timeout = setTimeout(() => {
          setDisplayed(fullText.slice(0, displayed.length + 1));
        }, typeSpeed);
      } else {
        timeout = setTimeout(() => setPhase("holding"), holdTime);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 0);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        timeout = setTimeout(() => {
          setDisplayed(displayed.slice(0, -1));
        }, deleteSpeed);
      } else {
        timeout = setTimeout(() => setPhase("pausing"), pauseBeforeNext);
      }
    } else if (phase === "pausing") {
      timeout = setTimeout(() => {
        setStatementIndex((i) => (i + 1) % statements.length);
        setPhase("typing");
      }, 0);
    }

    return () => clearTimeout(timeout);
  }, [displayed, phase, fullText, typeSpeed, deleteSpeed, holdTime, pauseBeforeNext, statements.length]);

  // Split the displayed text back into line1 (default color) and line2 (green) portions
  const line1Len = current.line1.length;
  const line1Shown = displayed.slice(0, line1Len);
  const line2Shown = displayed.slice(line1Len + 1); // +1 to skip the joining space

  return { line1Shown, line2Shown, line1Full: current.line1, isTypingLine1: displayed.length <= line1Len };
}

export default function HeroSection() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const prev = current === 0 ? products.length - 1 : current - 1;
  const next = current === products.length - 1 ? 0 : current + 1;

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const typedName = useTypewriter(products[current].name);

  // Headline: rotating 2-line statements — each types, holds, deletes, then cycles to the next — forever
  const headlineStatements = [
    { line1: "Science-Backed", line2: "Wellness For Everyday Vitality" },
    { line1: "Affordable Health,", line2: "Without Compromise" },
    { line1: "Premium Quality", line2: "At Prices Everyone Can Afford" },
    { line1: "Trusted Nutrition", line2: "For Every Pakistani Household" },
  ];
  const { line1Shown, line2Shown, isTypingLine1 } =
    useCyclingTypewriter(headlineStatements);

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

            <h1 className="hero-title hero-title-cycling">
              {line1Shown}
              {isTypingLine1 && <span className="typing-cursor">|</span>}
              <span className="hero-title-green">
                {line2Shown}
                {!isTypingLine1 && <span className="typing-cursor">|</span>}
              </span>
            </h1>

            <p className="hero-description">
              Carefully formulated supplements designed to
              support energy, recovery, immunity, and overall
              well-being through premium ingredients and
              research-driven nutrition.
            </p>

            <div className="hero-actions">
              <button className="hero-button" onClick={() => navigate("/products")}>
                Explore Our Products
              </button>

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
              <div className="hero-typewriter">
                <span className="hero-typewriter-label">Now Featuring</span>
                <span className="hero-typewriter-text">
                  {typedName}
                  <span className="typing-cursor">|</span>
                </span>
              </div>

              <div className="carousel-perspective">
                <AnimatePresence initial={false} custom={direction}>
                  {/* LEFT PRODUCT */}
                  <motion.img
                    key={`left-${prev}`}
                    src={products[prev].image}
                    alt=""
                    className="carousel-left"
                    initial={{ x: 0, scale: 0.85, opacity: 0, rotateY: 0 }}
                    animate={{
                      x: -160,
                      scale: 0.65,
                      rotateY: 40,
                      opacity: 0.3,
                    }}
                    exit={{ opacity: 0, scale: 0.5, x: -220 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />

                  {/* ACTIVE PRODUCT */}
                  <motion.img
                    key={`active-${current}`}
                    src={products[current].image}
                    alt={products[current].name}
                    className="carousel-active"
                    custom={direction}
                    initial={(dir) => ({
                      opacity: 0,
                      scale: 0.6,
                      x: dir > 0 ? 140 : -140,
                      rotateY: dir > 0 ? 35 : -35,
                    })}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      x: 0,
                      rotateY: 0,
                      y: [0, -6, 0],
                    }}
                    exit={(dir) => ({
                      opacity: 0,
                      scale: 0.6,
                      x: dir > 0 ? -140 : 140,
                      rotateY: dir > 0 ? -35 : 35,
                      transition: { duration: 0.5, ease: "easeInOut" },
                    })}
                    transition={{
                      duration: 0.9,
                      ease: [0.25, 0.46, 0.45, 0.94],
                      y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                    }}
                  />

                  {/* RIGHT PRODUCT */}
                  <motion.img
                    key={`right-${next}`}
                    src={products[next].image}
                    alt=""
                    className="carousel-right"
                    initial={{ x: 0, scale: 0.85, opacity: 0, rotateY: 0 }}
                    animate={{
                      x: 160,
                      scale: 0.65,
                      rotateY: -40,
                      opacity: 0.3,
                    }}
                    exit={{ opacity: 0, scale: 0.5, x: 220 }}
                    transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                  />
                </AnimatePresence>
              </div>

              {/* 3D GROUND SHADOW */}
              <motion.div
                key={`shadow-${current}`}
                className="carousel-shadow"
                initial={{ opacity: 0, scaleX: 0.7 }}
                animate={{
                  opacity: [0.5, 0.3, 0.5],
                  scaleX: [1, 0.85, 1],
                }}
                transition={{
                  opacity: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                  scaleX: { repeat: Infinity, duration: 4, ease: "easeInOut" },
                }}
              ></motion.div>

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