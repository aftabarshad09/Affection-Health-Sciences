import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";           // added for navigation
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import logo from "../assets/logo.png";
import "./Hero.css";
import banner1 from "../assets/banners/banner1111.jpeg";
import banner2 from "../assets/banners/banner2.jpeg";
import banner3 from "../assets/banners/banner333.jpeg";
import banner4 from "../assets/banners/banner444.png";

import A1 from "../assets/Grid/A1.png";
import B1 from "../assets/Grid/B1.png";
import C1 from "../assets/Grid/C1.png";
import D1 from "../assets/Grid/D1.png";

const banners = [
  {
    image: banner1,
    theme: {
      bg: "#f3eeff",
      accent: "#7c3aed",
      accentSoft: "rgba(124,58,237,0.14)",
    },
    showcase: D1,
    showcaseLabel: "Baby Nutrition",
    productLine: "Advanced Infant Formula",       // new field
  },
  {
    image: banner2,
    theme: {
      bg: "#edfaf3",
      accent: "#16a34a",
      accentSoft: "rgba(22,163,74,0.14)",
    },
    showcase: C1,
    showcaseLabel: "Baby Nutrition",
    productLine: "Prenatal Wellness Support",
  },
  {
    image: banner3,
    theme: {
      bg: "#eaf4ff",
      accent: "#1d4ed8",
      accentSoft: "rgba(29,78,216,0.14)",
    },
    showcase: A1,
    showcaseLabel: "Baby Nutrition",
    productLine: "Digestive Comfort Blend",
  },
  {
    image: banner4,
    theme: {
      bg: "#fff4e6",
      accent: "#ea580c",
      accentSoft: "rgba(234,88,12,0.14)",
    },
    showcase: B1,
    showcaseLabel: "Baby Nutrition",
    productLine: "Family Daily Multivitamin",
  },
];

const ShowcaseCard = ({ image, label }) => {
  // ... unchanged
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 14;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setPosition({ x, y });
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      className="showcase-card"
      onMouseMove={handleMove}
      onMouseLeave={resetPosition}
    >
      <div className="showcase-backdrop" />
      <AnimatePresence mode="wait">
        <motion.img
          key={image}
          src={image}
          alt={label}
          className="showcase-img"
          initial={{ opacity: 0, scale: 1.04, y: 10 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            x: position.x,
            rotateX: -position.y * 0.3,
            rotateY: position.x * 0.3,
          }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.5 },
            x: { type: "spring", stiffness: 90, damping: 18 },
            rotateX: { type: "spring", stiffness: 90, damping: 18 },
            rotateY: { type: "spring", stiffness: 90, damping: 18 },
          }}
        />
      </AnimatePresence>
    </div>
  );
};

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [[, direction], setImageIndex] = useState([0, 0]);
  const timeoutRef = useRef(null);
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);

  const currentBanner = banners[currentIndex];

  const paginate = (newDirection) => {
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) newIndex = banners.length - 1;
    if (newIndex >= banners.length) newIndex = 0;
    setImageIndex([newIndex, newDirection]);
    setCurrentIndex(newIndex);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => paginate(1), 5000);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => paginate(1), 5000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const handleBannerMove = (e) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setBannerPosition({ x, y });
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 500 : -500, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -500 : 500, opacity: 0, scale: 0.95 }),
  };

  return (
    <motion.section
      className="hero"
      animate={{ backgroundColor: currentBanner.theme.bg }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
    >
      <div className="hero-grid">
        {/* ── Banner ── */}
        <div
          className="div1"
          ref={bannerRef}
          onMouseMove={handleBannerMove}
          onMouseLeave={() => setBannerPosition({ x: 0, y: 0 })}
        >
          <div className="banner-container">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
                className="banner-slide"
              >
                <div
                  className="banner-backdrop"
                  style={{ backgroundImage: `url(${currentBanner.image})` }}
                />
                <motion.img
                  src={currentBanner.image}
                  alt={`Banner ${currentIndex}`}
                  className="hero-main-img"
                  animate={{ x: bannerPosition.x, y: bannerPosition.y }}
                  transition={{ type: "spring", stiffness: 150, damping: 25 }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* ── Right-side overlay (new) ── */}
          <div className="banner-overlay">
            <p className="overlay-company">Affection Health Sciences</p>
            <p className="overlay-product-line">{currentBanner.productLine}</p>
            <Link
              to="/products"
              className="overlay-btn"
              style={{ background: currentBanner.theme.accent }}
            >
              Explore Product
            </Link>
          </div>

          <motion.div
            className="banner-edge-fade"
            animate={{
              background: `linear-gradient(to top, ${currentBanner.theme.bg} 0%, transparent 100%)`,
            }}
            transition={{ duration: 0.7 }}
          />

          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? "active-dot" : ""}`}
                style={
                  currentIndex === index
                    ? { background: currentBanner.theme.accent }
                    : {}
                }
                onClick={() => {
                  const newDir = index > currentIndex ? 1 : -1;
                  setImageIndex([index, newDir]);
                  setCurrentIndex(index);
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => paginate(1), 5000);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* ── Logo removed completely ── */}
        {/* div2 deleted */}

        {/* ── Enhanced text block ── */}
        <div className="div8">
          <motion.span
            className="hero-eyebrow"
            animate={{
              color: currentBanner.theme.accent,
              borderColor: currentBanner.theme.accent + "55",
            }}
            transition={{ duration: 0.7 }}
          >
            Formulated with intention
          </motion.span>

          <h1 className="hero-title">
            Affection
            <br />
            <span className="hero-title-script">Health Sciences</span>
          </h1>

          <p className="hero-subtitle">
            Premium nutritional solutions for babies, women and families —
            scientifically formulated to support growth, wellness and a
            healthier future at every stage of life.
          </p>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">27+</span>
              <span className="hero-stat-label">Formulations</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">GMP</span>
              <span className="hero-stat-label">Certified Labs</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">0</span>
              <span className="hero-stat-label">Artificial Fillers</span>
            </div>
          </div>

          <div className="hero-actions">
            <motion.button
              className="browse-btn"
              style={{ borderColor: currentBanner.theme.accent + "66" }}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              EXPLORE PRODUCTS
            </motion.button>

            <div className="social-pill">
              <a href="#" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" aria-label="X">
                <FaXTwitter />
              </a>
              <a href="#" aria-label="Facebook">
                <FaFacebookF />
              </a>
            </div>
          </div>
        </div>

        {/* ── Expanded rotating showcase ── */}
        <div className="div3">
          <span className="showcase-mark" aria-hidden="true">
            {`0${currentIndex + 1}`}
          </span>
          <ShowcaseCard
            image={currentBanner.showcase}
            label={currentBanner.showcaseLabel}
          />
          <motion.span
            className="showcase-corner"
            animate={{ background: currentBanner.theme.accent }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;