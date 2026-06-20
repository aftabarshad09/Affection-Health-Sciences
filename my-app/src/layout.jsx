import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logo from './assets/logo2.png';
import './layout.css';
import Footer from './components/Footer';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const isActive = (path) =>
    location.pathname === path ? 'active' : '';

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="logo">
            <img src={logo} alt="Affection Health Sciences" className="logo-img" />
            <span className="logo-text">
              <span className="logo-main">Affection</span>
              <span className="logo-sub">Health Sciences</span>
            </span>
          </Link>

          <button
            className={`hamburger ${menuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          <nav className={`nav ${menuOpen ? 'open' : ''}`}>
            {[
              { to: '/', label: 'Home' },
              { to: '/about', label: 'Who We Are' },
              { to: '/products', label: 'Our Products' },
              { to: '/blogs', label: 'Wellness Blogs' },
              { to: '/careers', label: 'Careers' },
              { to: '/review', label: 'Reviews' },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`nav-link ${isActive(to)}`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <Link
              to="/contact"
              className="nav-cta"
              onClick={() => setMenuOpen(false)}
            >
              CONTACT US
            </Link>
          </nav>
        </div>
      </header>

      <main>{children}
        <Footer/>
      </main>
    </>
  );
};

export default Layout;