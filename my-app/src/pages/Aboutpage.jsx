import React from 'react';
import '../style/AboutPage.css';
import {
  FaFlask, FaLeaf, FaUsers, FaShieldAlt, FaAward,
  FaCheckCircle, FaLinkedinIn, FaTwitter
} from 'react-icons/fa';

/* ---------- Data ---------- */
const milestones = [
  { year: '2016', label: 'Founded', detail: 'Affection Health Sciences established with a focus on baby nutrition.' },
  { year: '2018', label: 'First Product Line', detail: 'Launched Hepatovital — our flagship hepatic nutrition formula.' },
  { year: '2020', label: 'Women\'s Health Range', detail: 'Expanded into women\'s wellness with Magnesium & Women\'s Health series.' },
  { year: '2022', label: 'Glutamine Series', detail: 'Glumin amino acid range launched for active recovery and gut health.' },
  { year: '2024', label: 'Regional Reach', detail: 'Products now available across South Asia and the Middle East.' },
];

const values = [
  { icon: <FaFlask />, title: 'Precision Science', desc: 'Every formula is developed with clinical rigour and peer-reviewed research at its core.' },
  { icon: <FaLeaf />, title: 'Clean Ingredients', desc: 'No artificial fillers, binders, or synthetic dyes — only what your body actually needs.' },
  { icon: <FaShieldAlt />, title: 'Safety First', desc: 'Third-party tested and manufactured in GMP-certified facilities for every batch.' },
  { icon: <FaUsers />, title: 'Family Focus', desc: 'We design for every life stage — from infant nutrition to adult wellness support.' },
  { icon: <FaAward />, title: 'Clinical Trust', desc: 'Trusted by healthcare professionals and families across the region.' },
  { icon: <FaCheckCircle />, title: 'Transparent Labels', desc: 'Full ingredient disclosure. No proprietary blends hiding what you\'re actually taking.' },
];

const team = [
  { name: 'Dr. Sara Rehman', role: 'Chief Nutrition Scientist', initials: 'SR' },
  { name: 'Ahmed Malik', role: 'Head of Product Development', initials: 'AM' },
  { name: 'Nadia Farooq', role: 'Director of Clinical Affairs', initials: 'NF' },
  { name: 'Usman Tariq', role: 'Co-Founder & CEO', initials: 'UT' },
];

/* ---------- Component ---------- */
const AboutPage = () => {
  return (
    <div className="about-pg">

      {/* Hero Banner */}
      <section className="apg-hero">
        <video
          className="apg-hero__video"
          src="/src/assets/videos/001.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="apg-hero__overlay" />
        <div className="apg-hero__content">
          <span className="apg-eyebrow">OUR STORY</span>
          <h1 className="apg-hero__heading">
            Science-Backed Nutrition <br /> for Every Stage of Life
          </h1>
          <p className="apg-hero__sub">
            We started with a single conviction: premium nutrition shouldn't be a privilege.
            Today, Affection Health Sciences serves thousands of families with formulas
            that are clinically designed, naturally sourced, and honestly labelled.
          </p>
        </div>
        <div className="apg-hero__stats">
          <div className="apg-stat"><span className="apg-stat__num">8+</span><span className="apg-stat__label">Years of Research</span></div>
          <div className="apg-stat"><span className="apg-stat__num">12</span><span className="apg-stat__label">Product Formulas</span></div>
          <div className="apg-stat"><span className="apg-stat__num">50K+</span><span className="apg-stat__label">Families Served</span></div>
          <div className="apg-stat"><span className="apg-stat__num">GMP</span><span className="apg-stat__label">Certified Facilities</span></div>
        </div>
      </section>

      {/* Mission */}
      <section className="apg-mission">
        <div className="apg-mission__inner">
          <div className="apg-mission__visual">
            <div className="apg-mission__blob">
              <FaFlask className="apg-mission__flask" />
            </div>
          </div>
          <div className="apg-mission__text">
            <span className="apg-eyebrow apg-eyebrow--dark">OUR MISSION</span>
            <h2>Why Affection Health Sciences Exists</h2>
            <p>
              We saw families struggling to find supplements they could actually trust —
              products cluttered with cheap fillers, misleading labels, and no real science
              behind the claims. Affection was built to change that.
            </p>
            <p>
              From hepatic support to infant nutrition, every product in our range begins
              the same way: with a clinician's question, a nutritionist's answer, and a
              lab's verification. We don't launch a formula until we're confident it works.
            </p>
            <ul className="apg-mission__list">
              <li><FaCheckCircle /> Developed by certified nutritionists and clinical scientists</li>
              <li><FaCheckCircle /> Tested for purity and potency before every batch ships</li>
              <li><FaCheckCircle /> Zero compromise on ingredient quality</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="apg-timeline">
        <div className="apg-section-header">
          <span className="apg-eyebrow">OUR JOURNEY</span>
          <h2>How We Got Here</h2>
        </div>
        <div className="apg-timeline__track">
          {milestones.map((m, i) => (
            <div className="apg-timeline__item" key={i}>
              <div className="apg-timeline__dot" />
              <div className="apg-timeline__card">
                <span className="apg-timeline__year">{m.year}</span>
                <h4>{m.label}</h4>
                <p>{m.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="apg-values">
        <div className="apg-section-header">
          <span className="apg-eyebrow">WHAT DRIVES US</span>
          <h2>Our Core Values</h2>
          <p>The principles that guide every formula, every label, and every decision we make.</p>
        </div>
        <div className="apg-values__grid">
          {values.map((v, i) => (
            <div className="apg-value-card" key={i}>
              <div className="apg-value-card__icon">{v.icon}</div>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="apg-team">
        <div className="apg-section-header">
          <span className="apg-eyebrow">THE PEOPLE</span>
          <h2>Meet Our Team</h2>
          <p>The scientists, clinicians, and founders behind every Affection product.</p>
        </div>
        <div className="apg-team__grid">
          {team.map((t, i) => (
            <div className="apg-team__card" key={i}>
              <div className="apg-team__avatar">{t.initials}</div>
              <h4>{t.name}</h4>
              <span>{t.role}</span>
              <div className="apg-team__social">
                <a href="#"><FaLinkedinIn /></a>
                <a href="#"><FaTwitter /></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="apg-cta">
        <h2>Ready to Experience the Difference?</h2>
        <p>Explore our full range of clinically formulated supplements.</p>
        <div className="apg-cta__btns">
          <a href="/products" className="apg-cta__primary">Explore Products</a>
          <a href="/contact" className="apg-cta__secondary">Contact Us</a>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;