import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from 'react-icons/fa6';
import logo from "../assets/logo.png";
import "./Hero.css";
import banner1 from "../assets/banners/banner1111.jpeg";
import banner2 from "../assets/banners/banner2.jpeg";
import banner3 from "../assets/banners/banner333.jpeg";

const banners = [
  {
    image: banner1,
  },
  {
    image: banner2,
  },
  {
    image: banner3,
  },
];

const smallCards = [
  {
    title: "Baby Nutrition",
    image:
      "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Whey Protein",
    image:
      "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Glumin",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Zinc & Magnesium",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Women's Health",
    image:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop",
  },
];

const ParallaxCard = ({ className, image, title, small }) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x =
      ((e.clientX - rect.left) / rect.width - 0.5) * 15;

    const y =
      ((e.clientY - rect.top) / rect.height - 0.5) * 15;

    setPosition({ x, y });
  };

  const resetPosition = () => {
    setPosition({
      x: 0,
      y: 0,
    });
  };

  return (
    <div
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={resetPosition}
    >
      <motion.img
        src={image}
        alt={title}
        className="hero-small-img"
        animate={{
          x: position.x,
          y: position.y,
          scale: 1.05,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
        }}
      />

      <div className={`image-overlay ${small ? "small" : ""}`}>
        <p>{title}</p>
      </div>
    </div>
  );
};

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [[imageIndex, direction], setImageIndex] = useState([0, 0]);
  const timeoutRef = useRef(null);
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 });
  const bannerRef = useRef(null);

  const paginate = (newDirection) => {
    let newIndex = currentIndex + newDirection;
    if (newIndex < 0) newIndex = banners.length - 1;
    if (newIndex >= banners.length) newIndex = 0;
    
    setImageIndex([newIndex, newDirection]);
    setCurrentIndex(newIndex);
    
    // Reset timer
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      paginate(1);
    }, 5000);
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      paginate(1);
    }, 5000);
    
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

  const resetBannerPosition = () => {
    setBannerPosition({ x: 0, y: 0 });
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section className="hero">
      <div className="hero-grid">
        {/* Banner */}
        <div 
          className="div1" 
          ref={bannerRef}
          onMouseMove={handleBannerMove}
          onMouseLeave={resetBannerPosition}
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
                  scale: { duration: 0.3 }
                }}
                className="banner-slide"
              >
                <motion.img
                  src={banners[currentIndex].image}
                  alt={`Banner ${currentIndex}`}
                  className="hero-main-img"
                  animate={{
                    x: bannerPosition.x,
                    y: bannerPosition.y,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="banner-dots">
            {banners.map((_, index) => (
              <button
                key={index}
                className={`dot ${
                  currentIndex === index ? "active-dot" : ""
                }`}
                onClick={() => {
                  const newDirection = index > currentIndex ? 1 : -1;
                  setImageIndex([index, newDirection]);
                  setCurrentIndex(index);
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => {
                      paginate(1);
                    }, 5000);
                  }
                }}
              />
            ))}
          </div>
        </div>

        {/* Logo */}
        <motion.div
          className="div2"
          animate={{
            boxShadow: [
              "0 0 20px rgba(0,0,0,.08)",
              "0 0 35px rgba(100,247,247,.25)",
              "0 0 20px rgba(0,0,0,.08)",
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
          }}
        >
          <img
            src={logo}
            alt="Affection Health Sciences"
            className="circle-img"
          />
        </motion.div>

        {/* Right Side Cards */}
        <ParallaxCard
          className="div3"
          image={smallCards[0].image}
          title={smallCards[0].title}
        />

        <ParallaxCard
          className="div4"
          image={smallCards[1].image}
          title={smallCards[1].title}
        />

        <ParallaxCard
          className="div5"
          image={smallCards[2].image}
          title={smallCards[2].title}
          small
        />

        <ParallaxCard
          className="div6"
          image={smallCards[3].image}
          title={smallCards[3].title}
          small
        />

        <ParallaxCard
          className="div7"
          image={smallCards[4].image}
          title={smallCards[4].title}
          small
        />

        {/* Content */}
        <div className="div8">
          <h1 className="hero-title">
            AFFECTION HEALTH SCIENCES
          </h1>

          <p className="hero-subtitle">
            Delivering premium nutritional solutions for
            babies, women and families. Scientifically
            formulated supplements designed to support
            growth, wellness and a healthier future.
          </p>
        </div>

        {/* Button */}
        <div className="div9">
          <motion.button
            className="browse-btn"
            whileHover={{
              scale: 1.05,
              y: -3,
            }}
            whileTap={{
              scale: 0.98,
            }}
          >
            EXPLORE PRODUCTS
          </motion.button>
        </div>

        {/* Social Icons */}
        <div className="div10">
          {/* <div className="social-icons">
            <motion.a
              href="#"
              whileHover={{
                y: -4,
                scale: 1.15,
              }}
            >
              <FaInstagram />
            </motion.a>

            <motion.a
              href="#"
              whileHover={{
                y: -4,
                scale: 1.15,
              }}
            >
              <FaTwitter />
            </motion.a>

            <motion.a
              href="#"
              whileHover={{
                y: -4,
                scale: 1.15,
              }}
            >
              <FaFacebookF />
            </motion.a>
          </div> */}
          <div className="social-pill">
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="X"><FaXTwitter /></a>
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;