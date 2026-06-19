import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import logo from "../assets/logo.png"; // adjust path to match your project
import "./Footer.css";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "Who We Are" },
  { to: "/products", label: "Our Products" },
  { to: "/blogs", label: "Wellness Blogs" },
  { to: "/careers", label: "Careers" },
  { to: "/contact", label: "Contact Us" },
];

const SOCIALS = [
  { href: "https://facebook.com", label: "Facebook", icon: FaFacebookF },
  { href: "https://instagram.com", label: "Instagram", icon: FaInstagram },
  { href: "https://linkedin.com", label: "LinkedIn", icon: FaLinkedinIn },
  { href: "https://twitter.com", label: "Twitter", icon: FaTwitter },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
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
                  <span itemProp="addressLocality">Islamabad, Pakistan</span>
                </li>
                <li>
                  <FaPhoneAlt aria-hidden="true" />
                  <a href="tel:+923001234567">+92 300 1234567</a>
                </li>
                <li>
                  <FaEnvelope aria-hidden="true" />
                  <a href="mailto:hello@affectionhealthsciences.com">hello@affectionhealthsciences.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-map" aria-label="Affection Health Sciences location">
            <iframe
              title="Affection Health Sciences — Islamabad location"
              src="https://www.google.com/maps?q=Islamabad,Pakistan&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">© {year} Affection Health Sciences. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <span className="footer-legal-dot" aria-hidden="true">•</span>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}