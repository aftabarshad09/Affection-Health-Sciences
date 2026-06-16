import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="footer-logo-text">
                <span className="footer-logo-main">Affection</span>
                <span className="footer-logo-sub">Health Sciences</span>
              </span>
            </Link>
            <p className="footer-description">
              Delivering premium nutritional solutions for babies, women and families. 
              Scientifically formulated supplements designed to support growth, 
              wellness and a healthier future.
            </p>
            <div className="footer-social">
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">Who We Are</Link></li>
              <li><Link to="/products">Our Products</Link></li>
              <li><Link to="/blogs">Wellness Blogs</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="footer-links">
            <h3>Our Products</h3>
            <ul>
              <li><Link to="/products/baby-nutrition">Baby Nutrition</Link></li>
              <li><Link to="/products/whey-protein">Whey Protein</Link></li>
              <li><Link to="/products/glumin">Glumin</Link></li>
              <li><Link to="/products/zinc-magnesium">Zinc & Magnesium</Link></li>
              <li><Link to="/products/womens-health">Women's Health</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h3>Get in Touch</h3>
            <ul>
              <li>
                <FaMapMarkerAlt />
                <span>123 Wellness Avenue, Health City, HC 12345</span>
              </li>
              <li>
                <FaPhone />
                <a href="tel:+1234567890">+1 (234) 567-890</a>
              </li>
              <li>
                <FaEnvelope />
                <a href="mailto:info@affectionhealth.com">info@affectionhealth.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Affection Health Sciences. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
            <Link to="/shipping-policy">Shipping Policy</Link>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to top">
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;