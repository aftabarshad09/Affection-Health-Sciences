import { useState } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaComments,
  FaUser,
  FaTag,
  FaPaperPlane,
  FaChevronDown,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import heroVideo from '../assets/videos/001.mp4';
import '../style/Contact.css';
import NewsletterStrip from '../components/Newsletter';

const contactInfo = [
  {
    Icon: FaEnvelope,
    title: 'Email',
    value: 'info@nutrifactor.com',
    description: 'Response within 24 hours'
  },
  {
    Icon: FaPhone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    description: 'Available Mon-Fri, 9AM-6PM EST'
  },
  {
    Icon: FaMapMarkerAlt,
    title: 'Address',
    value: '123 Wellness Street',
    description: 'New York, NY 10001, USA'
  },
  {
    Icon: FaComments,
    title: 'Live Chat',
    value: 'Available 24/7',
    description: 'Chat with our support team'
  }
];

const faqs = [
  {
    question: 'How long does shipping take?',
    answer: 'Standard shipping takes 5-7 business days. Express shipping available for 2-3 business days delivery.'
  },
  {
    question: "What's your return policy?",
    answer: "We offer a 30-day money-back guarantee on all products if you're not satisfied."
  },
  {
    question: 'Are your products vegan?',
    answer: 'Most of our products are vegan. Check individual product pages for specific dietary information.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship to 50+ countries worldwide with competitive international shipping rates.'
  }
];

const socialLinks = [
  { name: 'Facebook', Icon: FaFacebookF, className: 'cp-facebook' },
  { name: 'Twitter', Icon: FaXTwitter, className: 'cp-twitter' },
  { name: 'Instagram', Icon: FaInstagram, className: 'cp-instagram' },
  { name: 'LinkedIn', Icon: FaLinkedinIn, className: 'cp-linkedin' },
  { name: 'YouTube', Icon: FaYoutube, className: 'cp-youtube' },
  { name: 'TikTok', Icon: FaTiktok, className: 'cp-tiktok' }
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [activeFaq, setActiveFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }
      setSubmitted(true);
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to send message. Please try again.');
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe');
      }
      setSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setSubscribed(false);
      }, 3000);
    } catch {
      setSubscribed(false);
    }
  };

  const toggleFaq = (idx) => {
    setActiveFaq(prev => (prev === idx ? -1 : idx));
  };

  return (
    <div className="cp-page">
      {/* Hero Section with background video */}
      <section className="cp-hero">
        <div className="cp-hero__media" aria-hidden="true">
          <video
            className="cp-hero__video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="cp-hero__scrim" />
        </div>

        <div className="cp-hero__content">
          <span className="cp-hero__eyebrow">We're here to help</span>
          <h1 className="cp-hero__title">Get in Touch</h1>
          <p className="cp-hero__subtitle">
            We'd love to hear from you. Reach out anytime!
          </p>
        </div>

        <div className="cp-hero__scroll-hint" aria-hidden="true">
          <span /> Scroll
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="cp-info-section">
        <div className="cp-container">
          <div className="cp-section-header">
            <h2>Contact Information</h2>
            <p>Multiple ways to reach us - choose what works best for you</p>
          </div>
          <div className="cp-grid cp-grid-4">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="cp-info-card">
                <div className="cp-info-icon"><info.Icon size={28} /></div>
                <h3>{info.title}</h3>
                <p className="cp-info-value">{info.value}</p>
                <p className="cp-info-desc">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="cp-form-section cp-light-bg">
        <div className="cp-container">
          <div className="cp-form-wrapper">
            <div className="cp-form-column">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>

              {submitted && (
                <div className="cp-success-message">
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}

              {submitError && (
                <div className="cp-error-message">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="cp-form">
                <div className="cp-form-group">
                  <label htmlFor="cp-name">Full Name *</label>
                  <div className="cp-input-wrap">
                    <FaUser className="cp-input-icon" aria-hidden="true" />
                    <input
                      type="text"
                      id="cp-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                </div>

                <div className="cp-form-row">
                  <div className="cp-form-group">
                    <label htmlFor="cp-email">Email Address *</label>
                    <div className="cp-input-wrap">
                      <FaEnvelope className="cp-input-icon" aria-hidden="true" />
                      <input
                        type="email"
                        id="cp-email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="cp-form-group">
                    <label htmlFor="cp-phone">Phone Number</label>
                    <div className="cp-input-wrap">
                      <FaPhone className="cp-input-icon" aria-hidden="true" />
                      <input
                        type="tel"
                        id="cp-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div className="cp-form-group">
                  <label htmlFor="cp-subject">Subject *</label>
                  <div className="cp-input-wrap">
                    <FaTag className="cp-input-icon" aria-hidden="true" />
                    <select
                      id="cp-subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="product-inquiry">Product Inquiry</option>
                      <option value="customer-support">Customer Support</option>
                      <option value="business">Business Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="cp-form-group">
                  <label htmlFor="cp-message">Message *</label>
                  <textarea
                    id="cp-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message here..."
                    rows="5"
                  ></textarea>
                </div>

                <button type="submit" className="cp-btn cp-btn-primary cp-submit-btn" disabled={submitted}>
                  {submitted ? 'Message Sent' : 'Send Message'}
                  {!submitted && <FaPaperPlane className="cp-submit-btn__icon" aria-hidden="true" />}
                </button>
              </form>
            </div>

            <div className="cp-info-column">
              <h2>Quick Support</h2>
              <div className="cp-support-box">
                <h4>Business Hours</h4>
                <ul className="cp-hours-list">
                  <li><span>Monday - Friday:</span> 9:00 AM - 6:00 PM EST</li>
                  <li><span>Saturday:</span> 10:00 AM - 4:00 PM EST</li>
                  <li><span>Sunday:</span> Closed</li>
                </ul>
              </div>

              <div className="cp-support-box">
                <h4>Response Time</h4>
                <ul className="cp-response-list">
                  <li>📧 Email: Within 24 hours</li>
                  <li>📞 Phone: Within 2 hours</li>
                  <li>💬 Chat: Instant</li>
                </ul>
              </div>

              <div className="cp-support-box">
                <h4>Popular Inquiries</h4>
                <ul className="cp-inquiry-list">
                  <li><a href="#">Shipping Information</a></li>
                  <li><a href="#">Return Policy</a></li>
                  <li><a href="#">Product Recommendations</a></li>
                  <li><a href="#">Bulk Orders</a></li>
                  <li><a href="#">Wholesale Inquiries</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map / Location */}
      <section className="cp-map-section">
        <div className="cp-container">
          <div className="cp-map-card">
            <div className="cp-map-card__visual" aria-hidden="true">
              <div className="cp-map-card__pin">
                <FaMapMarkerAlt size={32} />
              </div>
            </div>
            <div className="cp-map-card__details">
              <h3>Visit Our Headquarters</h3>
              <p>123 Wellness Street, New York, NY 10001, USA</p>
              <p className="cp-map-card__hint">Open Monday – Saturday for scheduled visits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="cp-social-section">
        <div className="cp-container">
          <h2 className="cp-section-title">Connect With Us</h2>
          <p className="cp-section-subtitle">Follow us on social media for wellness tips and product updates</p>
          <div className="cp-social-buttons">
            {socialLinks.map(({ name, Icon, className }) => (
              <a key={name} href="#" className={`cp-social-btn ${className}`}>
                <Icon size={16} /> {name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="cp-faq cp-light-bg">
        <div className="cp-container">
          <h2 className="cp-section-title">Frequently Asked Questions</h2>
          <div className="cp-faq-list">
            {faqs.map((faq, idx) => (
              <div key={idx} className={`cp-faq-item ${activeFaq === idx ? 'cp-active' : ''}`}>
                <button
                  className="cp-faq-item__question"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={activeFaq === idx}
                >
                  <span>{faq.question}</span>
                  <FaChevronDown className="cp-faq-item__chevron" aria-hidden="true" />
                </button>
                <div className="cp-faq-item__answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <NewsletterStrip />
    </div>
  );
};

export default Contact;