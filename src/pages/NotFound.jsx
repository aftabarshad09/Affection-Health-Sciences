import { Link } from "react-router-dom";
import { FiArrowLeft, FiSearch, FiMail } from "react-icons/fi";
import "../style/NotFound.css";

export default function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-content">
        <span className="nf-eyebrow">Error 404</span>
        <h1 className="nf-title">This page wandered off.</h1>
        <p className="nf-lede">
          The page you're looking for doesn't exist, may have been moved, or the link
          might be outdated. Let's get you back on track.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btn--primary glass-btn">
            <FiArrowLeft size={15} /> Back to home
          </Link>
          <Link to="/products" className="nf-btn nf-btn--outline glass-btn">
            <FiSearch size={15} /> Browse products
          </Link>
          <Link to="/contact" className="nf-btn nf-btn--outline glass-btn">
            <FiMail size={15} /> Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
