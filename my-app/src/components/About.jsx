import React from 'react';
import './About.css';
import { FaFlask, FaLeaf, FaUsers, FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const pillars = [
  {
    icon: <FaFlask />,
    title: 'Clinically Formulated',
    desc: 'Every product is developed with precision — combining essential micronutrients and amino acids backed by science.',
  },
  {
    icon: <FaLeaf />,
    title: 'Natural Ingredients',
    desc: 'No artificial fillers. Only clean, natural compounds your body recognizes and absorbs efficiently.',
  },
  {
    icon: <FaUsers />,
    title: 'Trusted by Families',
    desc: 'From babies to adults, our range supports every stage of life with safe, targeted nutrition.',
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <section className="about-home">
      <div className="about-home__inner">
        {/* Left: text */}
        <div className="about-home__text">
          <span className="about-home__eyebrow">WHO WE ARE</span>
          <h2 className="about-home__heading">
            Nutrition Built on <em>Science</em>, Delivered with <em>Care</em>
          </h2>
          <p className="about-home__body">
            Affection Health Sciences was founded with one belief — that every family deserves
            access to premium, trustworthy nutrition. We formulate supplements that go beyond
            generic solutions, targeting real needs at every life stage.
          </p>
          <button className="about-home__cta" onClick={() => navigate('/about')}>
            Our Full Story <FaArrowRight />
          </button>
        </div>

        {/* Right: pillars */}
        <div className="about-home__pillars">
          {pillars.map((p, i) => (
            <div className="about-home__pillar" key={i}>
              <div className="about-home__pillar-icon">{p.icon}</div>
              <div>
                <h4>{p.title}</h4>
                <p>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;