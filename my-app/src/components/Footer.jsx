import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import logo from "../assets/logo3.png";
import "./Footer.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/products", label: "Products" },
  { to: "/blogs", label: "Blogs" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
];

const SOCIALS = [
  { href: "https://www.facebook.com/share/1A8zXHbfSK/", label: "Facebook", icon: FaFacebookF },
  { href: "https://www.instagram.com/affectionhealth_sciences?igsh=MXkxMWUyanlhd3BiNg%3D%3D&utm_source=qr", label: "Instagram", icon: FaInstagram },
  { href: "https://www.linkedin.com/company/affection-healtb-sciences/", label: "LinkedIn", icon: FaLinkedinIn },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      {/* Wave Background */}
      <div className="footer-wave-container">
        <svg
          className="footer-waves"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="footerWaveBlur1">
              <feGaussianBlur stdDeviation="2" />
            </filter>
            <filter id="footerWaveBlur2">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="footerWaveBlur3">
              <feGaussianBlur stdDeviation="6" />
            </filter>
            
            <linearGradient id="footerWaveGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#1B4332', stopOpacity: 0.2 }} />
              <stop offset="15%" style={{ stopColor: '#1B4332', stopOpacity: 0.5 }} />
              <stop offset="50%" style={{ stopColor: '#1B4332', stopOpacity: 0.75 }} />
              <stop offset="85%" style={{ stopColor: '#1B4332', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#1B4332', stopOpacity: 0.2 }} />
            </linearGradient>
            
            <linearGradient id="footerWaveGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#1B4332', stopOpacity: 0.2 }} />
              <stop offset="20%" style={{ stopColor: '#1B4332', stopOpacity: 0.5 }} />
              <stop offset="50%" style={{ stopColor: '#1B4332', stopOpacity: 0.75 }} />
              <stop offset="80%" style={{ stopColor: '#1B4332', stopOpacity: 0.5 }} />
              <stop offset="100%" style={{ stopColor: '#1B4332', stopOpacity: 0.2 }} />
            </linearGradient>
          </defs>

          {/* Layer 1 - Deep wave */}
          <path
            className="footer-wave footer-wave1"
            d="M0,100 C180,50 360,130 540,80 C720,30 900,110 1080,70 C1260,30 1380,90 1440,70 L1440,200 L0,200 Z"
            fill="url(#footerWaveGradient1)"
            filter="url(#footerWaveBlur1)"
          />

          {/* Layer 2 - Medium wave */}
          <path
            className="footer-wave footer-wave2"
            d="M0,130 C240,80 480,150 720,100 C960,50 1200,130 1440,90 L1440,200 L0,200 Z"
            fill="url(#footerWaveGradient2)"
            filter="url(#footerWaveBlur2)"
          />

          {/* Layer 3 - Light wave */}
          <path
            className="footer-wave footer-wave3"
            d="M0,160 C300,110 600,170 900,130 C1200,90 1350,150 1440,120 L1440,200 L0,200 Z"
            fill="url(#footerWaveGradient1)"
            filter="url(#footerWaveBlur3)"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="footer-bg" aria-hidden="true">
        <span className="footer-circle footer-circle--one" />
        <span className="footer-circle footer-circle--two" />
        <span className="footer-circle footer-circle--three" />
        <span className="footer-circle footer-circle--four" />
      </div>

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-main">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="Affection Health Sciences" className="footer-logo-img" />
              <span className="footer-logo-text">
                <span className="footer-logo-main">Affection</span>
                <span className="footer-logo-sub">Health Sciences</span>
              </span>
            </Link>

            <p className="footer-tagline">
              Wellness, formulated with intention — research-led products made
              for people who read the label.
            </p>

            <ul className="footer-socials" aria-label="Follow us on social media">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="footer-social-link">
                    <s.icon size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-cols">
            <nav className="footer-col" aria-label="Footer navigation">
              <h3 className="footer-col-title">Explore</h3>
              <ul>
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer-col" itemScope itemType="https://schema.org/PostalAddress">
              <h3 className="footer-col-title">Contact</h3>
              <ul className="footer-contact-list">
                <li>
                  <FaMapMarkerAlt aria-hidden="true" />
                  <span itemProp="streetAddress">B109 Satellite Town, Rawalpindi, Pakistan</span>
                </li>
                <li>
                  <FaPhoneAlt aria-hidden="true" />
                  <a href="https://wa.me/923319845081" target="_blank" rel="noopener noreferrer">+92 331 9845081</a>
                </li>
                <li>
                  <FaEnvelope aria-hidden="true" />
                  <a href="mailto:info@affectionhealthsciences.com">info@affectionhealthsciences.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-map">
            <iframe
              title="Affection Health Sciences — B109 Satellite Town, Rawalpindi location"
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3321.8087718636157!2d73.06602507569875!3d33.63619997331652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzPCsDM4JzEwLjMiTiA3M8KwMDQnMDcuMCJF!5e0!3m2!1sen!2s!4v1782048699926!5m2!1sen!2s"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© {year} Affection Health Sciences. All rights reserved.</p>
          <div className="footer-legal">
            <a href="https://qodexaa.com/" target="_blank" rel="noopener noreferrer">
              made with Qodexaa
            </a>
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-legal-dot" aria-hidden="true">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}