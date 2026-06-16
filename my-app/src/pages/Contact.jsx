import React, { useState } from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaComments } from 'react-icons/fa';
import Hero from '../components/Hero';
import '../style/Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Here you would send the form data to your backend
    setTimeout(() => {
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

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
      question: 'What\'s your return policy?',
      answer: 'We offer a 30-day money-back guarantee on all products if you\'re not satisfied.'
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

  return (
    <div className="contact-page">
      <Hero 
        title="Get in Touch" 
        subtitle="We'd love to hear from you. Reach out anytime!"
        image="💌"
      />

      {/* Contact Info Cards */}
      <section className="contact-info-section">
        <div className="container">
          <div className="section-header">
            <h2>Contact Information</h2>
            <p>Multiple ways to reach us - choose what works best for you</p>
          </div>
          <div className="grid grid-4">
            {contactInfo.map((info, idx) => (
              <div key={idx} className="info-card">
                <div className="info-icon"><info.Icon size={40} /></div>
                <h3>{info.title}</h3>
                <p className="info-value">{info.value}</p>
                <p className="info-desc">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="contact-form-section light-bg">
        <div className="container">
          <div className="form-wrapper">
            <div className="form-column">
              <h2>Send Us a Message</h2>
              <p>Fill out the form below and we'll get back to you as soon as possible.</p>
              
              {submitted && (
                <div className="success-message">
                  ✓ Thank you! Your message has been sent successfully.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
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

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Your message here..."
                    rows="5"
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>

            <div className="info-column">
              <h2>Quick Support</h2>
              <div className="support-box">
                <h4>Business Hours</h4>
                <ul className="hours-list">
                  <li><span>Monday - Friday:</span> 9:00 AM - 6:00 PM EST</li>
                  <li><span>Saturday:</span> 10:00 AM - 4:00 PM EST</li>
                  <li><span>Sunday:</span> Closed</li>
                </ul>
              </div>

              <div className="support-box">
                <h4>Response Time</h4>
                <ul className="response-list">
                  <li>📧 Email: Within 24 hours</li>
                  <li>📞 Phone: Within 2 hours</li>
                  <li>💬 Chat: Instant</li>
                </ul>
              </div>

              <div className="support-box">
                <h4>Popular Inquiries</h4>
                <ul className="inquiry-list">
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

      {/* Social Media */}
      <section className="social-section">
        <div className="container">
          <h2 className="section-title">Connect With Us</h2>
          <p className="section-subtitle">Follow us on social media for wellness tips and product updates</p>
          <div className="social-buttons">
            <a href="#" className="social-btn facebook">
              <span>f</span> Facebook
            </a>
            <a href="#" className="social-btn twitter">
              <span>𝕏</span> Twitter
            </a>
            <a href="#" className="social-btn instagram">
              <span>📷</span> Instagram
            </a>
            <a href="#" className="social-btn linkedin">
              <span>in</span> LinkedIn
            </a>
            <a href="#" className="social-btn youtube">
              <span>▶️</span> YouTube
            </a>
            <a href="#" className="social-btn tiktok">
              <span>🎵</span> TikTok
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="contact-faq light-bg">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            {faqs.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <h4>{faq.question}</h4>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get wellness tips and special offers delivered to your inbox</p>
            <form className="cta-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
