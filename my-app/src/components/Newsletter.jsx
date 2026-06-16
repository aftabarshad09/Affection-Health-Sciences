import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle subscription
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="newsletter">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Stay Updated on Wellness</h2>
            <p>Get expert nutrition tips, exclusive offers, and new product launches delivered to your inbox.</p>
          </div>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="form-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
              />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </div>
            {submitted && (
              <p className="success-msg">✓ Thanks for subscribing!</p>
            )}
          </form>

          <p className="newsletter-note">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
