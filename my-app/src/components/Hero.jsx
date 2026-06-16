// import React, { useEffect, useState, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { FaInstagram, FaFacebookF } from "react-icons/fa";
// import { FaXTwitter } from 'react-icons/fa6';
// import logo from "../assets/logo.png";
// import "./Hero.css";
// import banner3 from "../assets/banners/banner1111.jpeg";
// import banner2 from "../assets/banners/banner2.jpeg";
// import banner1 from "../assets/banners/banner333.jpeg";

// import A1 from "../assets/Grid/A1.png";
// import A2 from "../assets/Grid/A2.png";
// import A3 from "../assets/Grid/A3.png";
// import B1 from "../assets/Grid/B1.png";
// import B2 from "../assets/Grid/B2.png";
// import B3 from "../assets/Grid/B3.png";
// import C1 from "../assets/Grid/C1.png";
// import C2 from "../assets/Grid/C2.png";
// import C3 from "../assets/Grid/C3.png";
// import D1 from "../assets/Grid/D1.png";
// import D2 from "../assets/Grid/D2.png";
// import D3 from "../assets/Grid/D3.png";

// const banners = [
//   {
//     image: banner1,
//     theme: {
//       bg: "#f3eeff",
//       accent: "#7c3aed",
//       cardBg: "rgba(124,58,237,0.08)",
//     },

//     cards: {
//       babyNutrition: A1,
//       zincWomen:     A3,
//       glumin:        A2,
//     },
//   },
//   {
//     image: banner2,
//     theme: {
//       bg: "#edfaf3",
//       accent: "#16a34a",
//       cardBg: "rgba(22,163,74,0.08)",
//     },
//     cards: {
//       babyNutrition: C1,
//       zincWomen:     C3,
//       glumin:        C2,
//     },
//   },
//   {
//     image: banner3,
//     theme: {
//       bg: "#eaf4ff",
//       accent: "#1d4ed8",
//       cardBg: "rgba(29,78,216,0.08)",
//     },
//     cards: {
//       babyNutrition: D1,
//       zincWomen:     D3,
//       glumin:        D2,
//     },
//   },
// ];

// const ParallaxCard = ({ className, image, title, small, cardBg }) => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });

//   const handleMove = (e) => {
//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
//     const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
//     setPosition({ x, y });
//   };

//   const resetPosition = () => setPosition({ x: 0, y: 0 });

//   return (
//     <div
//       className={className}
//       onMouseMove={handleMove}
//       onMouseLeave={resetPosition}
//       style={{ background: cardBg }}
//     >
//       <AnimatePresence mode="wait">
//         <motion.img
//           key={image}
//           src={image}
//           alt={title}
//           className="hero-small-img"
//           initial={{ opacity: 0, scale: 1.05 }}
//           animate={{
//             opacity: 1,
//             scale: 1.05,
//             x: position.x,
//             y: position.y,
//           }}
//           exit={{ opacity: 0 }}
//           transition={{ opacity: { duration: 0.5 }, x: { type: "spring", stiffness: 100, damping: 20 }, y: { type: "spring", stiffness: 100, damping: 20 } }}
//         />
//       </AnimatePresence>

//       <div className={`image-overlay ${small ? "small" : ""}`}>
//         <p>{title}</p>
//       </div>
//     </div>
//   );
// };

// const Hero = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [[, direction], setImageIndex] = useState([0, 0]);
//   const timeoutRef = useRef(null);
//   const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 });
//   const bannerRef = useRef(null);

//   const currentBanner = banners[currentIndex];

//   const paginate = (newDirection) => {
//     let newIndex = currentIndex + newDirection;
//     if (newIndex < 0) newIndex = banners.length - 1;
//     if (newIndex >= banners.length) newIndex = 0;
//     setImageIndex([newIndex, newDirection]);
//     setCurrentIndex(newIndex);
//     if (timeoutRef.current) clearTimeout(timeoutRef.current);
//     timeoutRef.current = setTimeout(() => paginate(1), 5000);
//   };

//   useEffect(() => {
//     timeoutRef.current = setTimeout(() => paginate(1), 5000);
//     return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
//   }, [currentIndex]);

//   const handleBannerMove = (e) => {
//     if (!bannerRef.current) return;
//     const rect = bannerRef.current.getBoundingClientRect();
//     const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
//     const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
//     setBannerPosition({ x, y });
//   };

//   const variants = {
//     enter: (dir) => ({ x: dir > 0 ? 500 : -500, opacity: 0, scale: 0.95 }),
//     center: { x: 0, opacity: 1, scale: 1 },
//     exit: (dir) => ({ x: dir > 0 ? -500 : 500, opacity: 0, scale: 0.95 }),
//   };

//   return (
//     <motion.section
//       className="hero"
//       animate={{ backgroundColor: currentBanner.theme.bg }}
//       transition={{ duration: 0.7, ease: "easeInOut" }}
//     >
//       <div className="hero-grid">

//         {/* ── Banner ── */}
//         <div
//           className="div1"
//           ref={bannerRef}
//           onMouseMove={handleBannerMove}
//           onMouseLeave={() => setBannerPosition({ x: 0, y: 0 })}
//         >
//           <div className="banner-container">
//             <AnimatePresence initial={false} custom={direction} mode="popLayout">
//               <motion.div
//                 key={currentIndex}
//                 custom={direction}
//                 variants={variants}
//                 initial="enter"
//                 animate="center"
//                 exit="exit"
//                 transition={{
//                   x: { type: "spring", stiffness: 300, damping: 30 },
//                   opacity: { duration: 0.3 },
//                   scale: { duration: 0.3 },
//                 }}
//                 className="banner-slide"
//               >
//                 <motion.img
//                   src={currentBanner.image}
//                   alt={`Banner ${currentIndex}`}
//                   className="hero-main-img"
//                   animate={{ x: bannerPosition.x, y: bannerPosition.y }}
//                   transition={{ type: "spring", stiffness: 150, damping: 25 }}
//                 />
//               </motion.div>
//             </AnimatePresence>
//           </div>

//           <div className="banner-dots">
//             {banners.map((_, index) => (
//               <button
//                 key={index}
//                 className={`dot ${currentIndex === index ? "active-dot" : ""}`}
//                 style={currentIndex === index ? { background: currentBanner.theme.accent } : {}}
//                 onClick={() => {
//                   const newDir = index > currentIndex ? 1 : -1;
//                   setImageIndex([index, newDir]);
//                   setCurrentIndex(index);
//                   if (timeoutRef.current) {
//                     clearTimeout(timeoutRef.current);
//                     timeoutRef.current = setTimeout(() => paginate(1), 5000);
//                   }
//                 }}
//               />
//             ))}
//           </div>
//         </div>

//         {/* ── Logo ── */}
//         <motion.div
//           className="div2"
//           animate={{
//             boxShadow: [
//               `0 0 20px rgba(0,0,0,.08)`,
//               `0 0 35px ${currentBanner.theme.accent}44`,
//               `0 0 20px rgba(0,0,0,.08)`,
//             ],
//           }}
//           transition={{ duration: 4, repeat: Infinity }}
//         >
//           <img src={logo} alt="Affection Health Sciences" className="circle-img" />
//         </motion.div>

//         {/* ── Baby Nutrition Card (div3) ── */}
//         <ParallaxCard
//           className="div3"
//           image={currentBanner.cards.babyNutrition}
//           title="Baby Nutrition"
//           cardBg={currentBanner.theme.cardBg}
//         />

//         {/* ── Text Block replacing Whey Protein (div4) ── */}
//         <motion.div
//           className="div4 text-block"
//           animate={{ borderColor: currentBanner.theme.accent + "55" }}
//           transition={{ duration: 0.7 }}
//           style={{ borderLeft: `4px solid ${currentBanner.theme.accent}` }}
//         >
//           <span className="text-block-eyebrow" style={{ color: currentBanner.theme.accent }}>
//             Why Choose Us
//           </span>
//           <h3 className="text-block-heading">
//             Science-Backed Nutrition You Can Trust
//           </h3>
//           <p className="text-block-body">
//             Every formula is developed with clinical precision — combining essential
//             micronutrients, amino acids, and natural ingredients to support your
//             body at every stage of life.
//           </p>
//           <ul className="text-block-list">
//             <li>✦ Clinically formulated</li>
//             <li>✦ No artificial fillers</li>
//             <li>✦ Trusted by families</li>
//           </ul>
//         </motion.div>

//         {/* ── Merged Zinc & Women's Health Card (div5+div6 → div5) ── */}
//         <ParallaxCard
//           className="div5"
//           image={currentBanner.cards.zincWomen}
//           title="Zinc & Magnesium · Women's Health"
//           small
//           cardBg={currentBanner.theme.cardBg}
//         />

//         {/* ── Glumin Card (div7 → div6) ── */}
//         <ParallaxCard
//           className="div6"
//           image={currentBanner.cards.glumin}
//           title="Glumin"
//           small
//           cardBg={currentBanner.theme.cardBg}
//         />

//         {/* ── Text ── */}
//         <div className="div8">
//           <h1 className="hero-title">AFFECTION HEALTH SCIENCES</h1>
//           <p className="hero-subtitle">
//             Delivering premium nutritional solutions for babies, women and families.
//             Scientifically formulated supplements designed to support growth,
//             wellness and a healthier future.
//           </p>
//         </div>

//         {/* ── Button ── */}
//         <div className="div9">
//           <motion.button
//             className="browse-btn"
//             style={{ borderColor: currentBanner.theme.accent + "66" }}
//             whileHover={{ scale: 1.05, y: -3 }}
//             whileTap={{ scale: 0.98 }}
//           >
//             EXPLORE PRODUCTS
//           </motion.button>
//         </div>

//         {/* ── Socials ── */}
//         <div className="div10">
//           <div className="social-pill">
//             <a href="#" aria-label="Instagram"><FaInstagram /></a>
//             <a href="#" aria-label="X"><FaXTwitter /></a>
//             <a href="#" aria-label="Facebook"><FaFacebookF /></a>
//           </div>
//         </div>

//       </div>
//     </motion.section>
//   );
// };

// export default Hero;

























import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import logo from "../assets/logo.png";
import "./Hero.css";
import banner1 from "../assets/banners/banner1111.jpeg";
import banner2 from "../assets/banners/banner2.jpeg";
import banner3 from "../assets/banners/banner333.jpeg";
import banner4 from "../assets/banners/banner444.png"; // 🆕 4th banner image

import A1 from "../assets/Grid/A1.png";
import A2 from "../assets/Grid/A2.png";
import A3 from "../assets/Grid/A3.png";
import B1 from "../assets/Grid/B1.png";
import B2 from "../assets/Grid/B2.png";
import B3 from "../assets/Grid/B3.png";
import C1 from "../assets/Grid/C1.png";
import C2 from "../assets/Grid/C2.png";
import C3 from "../assets/Grid/C3.png";
import D1 from "../assets/Grid/D1.png";
import D2 from "../assets/Grid/D2.png";
import D3 from "../assets/Grid/D3.png";

const banners = [
  {
    image: banner1,
    theme: {
      bg: "#f3eeff",
      accent: "#7c3aed",
      cardBg: "rgba(124,58,237,0.08)",
    },
    cards: {
      babyNutrition: D1,
      zincWomen:     D3,
      glumin:        D2,
    },
  },
  {
    image: banner2,
    theme: {
      bg: "#edfaf3",
      accent: "#16a34a",
      cardBg: "rgba(22,163,74,0.08)",
    },
    cards: {
      babyNutrition: C1,
      zincWomen:     C3,
      glumin:        C2,
    },
  },
  {
    image: banner3,
    theme: {
      bg: "#eaf4ff",
      accent: "#1d4ed8",
      cardBg: "rgba(29,78,216,0.08)",
    },
    cards: {
      babyNutrition: A1,
      zincWomen:     A3,
      glumin:        A2,
    },
  },
  // 🆕 4th banner – using the B card set
  {
    image: banner4,
    theme: {
      bg: "#fff4e6",
      accent: "#ea580c",
      cardBg: "rgba(234,88,12,0.08)",
    },
    cards: {
      babyNutrition: B1,
      zincWomen:     B3,
      glumin:        B2,
    },
  },
];

const ParallaxCard = ({ className, image, title, small, cardBg }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 15;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 15;
    setPosition({ x, y });
  };

  const resetPosition = () => setPosition({ x: 0, y: 0 });

  return (
    <div
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={resetPosition}
      style={{ background: cardBg }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={image}
          src={image}
          alt={title}
          className="hero-small-img"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: 1,
            scale: 1.05,
            x: position.x,
            y: position.y,
          }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 0.5 }, x: { type: "spring", stiffness: 100, damping: 20 }, y: { type: "spring", stiffness: 100, damping: 20 } }}
        />
      </AnimatePresence>

      <div className={`image-overlay ${small ? "small" : ""}`}>
        <p>{title}</p>
      </div>
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
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
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

          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? "active-dot" : ""}`}
                style={currentIndex === index ? { background: currentBanner.theme.accent } : {}}
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

        {/* ── Logo ── */}
        <motion.div
          className="div2"
          animate={{
            boxShadow: [
              `0 0 20px rgba(0,0,0,.08)`,
              `0 0 35px ${currentBanner.theme.accent}44`,
              `0 0 20px rgba(0,0,0,.08)`,
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          <img src={logo} alt="Affection Health Sciences" className="circle-img" />
        </motion.div>

        {/* ── Baby Nutrition Card (div3) ── */}
        <ParallaxCard
          className="div3"
          image={currentBanner.cards.babyNutrition}
          title="Baby Nutrition"
          cardBg={currentBanner.theme.cardBg}
        />

        {/* ── Text Block replacing Whey Protein (div4) ── */}
        <motion.div
          className="div4 text-block"
          animate={{ borderColor: currentBanner.theme.accent + "55" }}
          transition={{ duration: 0.7 }}
          style={{ borderLeft: `4px solid ${currentBanner.theme.accent}` }}
        >
          <span className="text-block-eyebrow" style={{ color: currentBanner.theme.accent }}>
            Why Choose Us
          </span>
          <h3 className="text-block-heading">
            Science-Backed Nutrition You Can Trust
          </h3>
          <p className="text-block-body">
            Every formula is developed with clinical precision — combining essential
            micronutrients, amino acids, and natural ingredients to support your
            body at every stage of life.
          </p>
          <ul className="text-block-list">
            <li>✦ Clinically formulated</li>
            <li>✦ No artificial fillers</li>
            <li>✦ Trusted by families</li>
          </ul>
        </motion.div>

        {/* ── Merged Zinc & Women's Health Card (div5) ── */}
        <ParallaxCard
          className="div5"
          image={currentBanner.cards.zincWomen}
          title="Zinc & Magnesium · Women's Health"
          small
          cardBg={currentBanner.theme.cardBg}
        />

        {/* ── Glumin Card (div6) ── */}
        <ParallaxCard
          className="div6"
          image={currentBanner.cards.glumin}
          title="Glumin"
          small
          cardBg={currentBanner.theme.cardBg}
        />

        {/* ── Text ── */}
        <div className="div8">
          <h1 className="hero-title">AFFECTION HEALTH SCIENCES</h1>
          <p className="hero-subtitle">
            Delivering premium nutritional solutions for babies, women and families.
            Scientifically formulated supplements designed to support growth,
            wellness and a healthier future.
          </p>
        </div>

        {/* ── Button ── */}
        <div className="div9">
          <motion.button
            className="browse-btn"
            style={{ borderColor: currentBanner.theme.accent + "66" }}
            whileHover={{ scale: 1.05, y: -3 }}
            whileTap={{ scale: 0.98 }}
          >
            EXPLORE PRODUCTS
          </motion.button>
        </div>

        {/* ── Socials ── */}
        <div className="div10">
          <div className="social-pill">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="X"><FaXTwitter /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          </div>
        </div>

      </div>
    </motion.section>
  );
};

export default Hero;