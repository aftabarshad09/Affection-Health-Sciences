import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaHeart } from 'react-icons/fa';
import logo from './assets/logo3.png';
import './layout.css';
import Footer from './components/Footer';
import { useCartStore } from './modules/cart/cartStore';
import { useWishlistStore } from './modules/wishlist/wishlistStore';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((s) => s.itemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);

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
        <div className={`header-inner ${menuOpen ? 'menu-open' : ''}`}>
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
              className="nav-cta glass-btn"
              onClick={() => setMenuOpen(false)}
            >
              CONTACT US
            </Link>

            <Link
              to="/wishlist"
              className="nav-admin-btn nav-cart-btn"
              onClick={() => setMenuOpen(false)}
              title="Wishlist"
            >
              <FaHeart size={13} />
              {wishlistCount > 0 && <span className="nav-cart-badge">{wishlistCount}</span>}
            </Link>

            <Link
              to="/cart"
              className="nav-admin-btn nav-cart-btn"
              onClick={() => setMenuOpen(false)}
              title="Cart"
            >
              <FaShoppingCart size={13} />
              {itemCount > 0 && <span className="nav-cart-badge">{itemCount}</span>}
            </Link>
          </nav>
        </div>
      </header>

      <main className="site-main">{children}
        <Footer/>
      </main>
    </>
  );
};

export default Layout;