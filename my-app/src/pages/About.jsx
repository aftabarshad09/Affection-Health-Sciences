import React from 'react';
import { FaBuilding, FaUserTie } from 'react-icons/fa';
import Hero from '../components/Hero';
import '../style/About.css';

const About = () => {
  const team = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      position: 'Founder & Nutritionist',
      bio: 'PhD in Nutritional Science with 15+ years of experience'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      position: 'Chief Scientist',
      bio: 'Expert in biochemistry and supplement formulation'
    },
    {
      id: 3,
      name: 'Emily Williams',
      position: 'Product Manager',
      bio: 'Passionate about making nutrition accessible to everyone'
    },
    {
      id: 4,
      name: 'James Martinez',
      position: 'Quality Assurance',
      bio: 'Ensures every product meets our strict quality standards'
    }
  ];

  return (
    <div className="about-page">
      <Hero 
        title="About NutriFactor" 
        subtitle="Leading the nutrition revolution"
        Icon={FaBuilding}
      />

      {/* Mission & Vision */}
      <section className="mission-vision">
        <div className="container">
          <div className="grid grid-2">
            <div className="mission-box">
              <h2>Our Mission</h2>
              <p>
                To empower individuals with premium, science-backed nutritional supplements that enhance their health, wellness, and quality of life. We believe that good nutrition is the foundation of a healthy life.
              </p>
            </div>
            <div className="vision-box">
              <h2>Our Vision</h2>
              <p>
                To become the most trusted nutrition brand globally, recognized for our commitment to quality, innovation, and customer success. We envision a world where everyone has access to the best nutritional supplements.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values light-bg">
        <div className="container">
          <h2 className="section-title">Our Core Values</h2>
          <div className="grid grid-3">
            <div className="value-card">
              <div className="value-number">01</div>
              <h3>Quality First</h3>
              <p>We never compromise on quality. Every ingredient is carefully selected and tested.</p>
            </div>
            <div className="value-card">
              <div className="value-number">02</div>
              <h3>Transparency</h3>
              <p>We're open about our sourcing, testing, and formulation processes.</p>
            </div>
            <div className="value-card">
              <div className="value-number">03</div>
              <h3>Innovation</h3>
              <p>We continuously invest in research and development for better products.</p>
            </div>
            <div className="value-card">
              <div className="value-number">04</div>
              <h3>Sustainability</h3>
              <p>We care about the environment and use eco-friendly packaging.</p>
            </div>
            <div className="value-card">
              <div className="value-number">05</div>
              <h3>Customer Focus</h3>
              <p>Your health and satisfaction is our top priority.</p>
            </div>
            <div className="value-card">
              <div className="value-number">06</div>
              <h3>Integrity</h3>
              <p>We conduct business with honesty and ethical practices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline">
        <div className="container">
          <h2 className="section-title">Our Journey</h2>
          <div className="timeline-content">
            <div className="timeline-item">
              <div className="timeline-marker">2015</div>
              <div className="timeline-text">
                <h3>Founded</h3>
                <p>NutriFactor was founded with a vision to make premium nutrition accessible.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2017</div>
              <div className="timeline-text">
                <h3>First Product Launch</h3>
                <p>Launched our flagship zinc and magnesium supplement.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2019</div>
              <div className="timeline-text">
                <h3>Expansion</h3>
                <p>Expanded to 50+ countries with 25+ products in our line.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2021</div>
              <div className="timeline-text">
                <h3>100K+ Customers</h3>
                <p>Reached milestone of 100,000 satisfied customers worldwide.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2023</div>
              <div className="timeline-text">
                <h3>Industry Recognition</h3>
                <p>Awarded "Best Nutrition Brand" by international health organizations.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-marker">2024</div>
              <div className="timeline-text">
                <h3>Present Day</h3>
                <p>Continuing to innovate and serve our growing global community.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team light-bg">
        <div className="container">
          <h2 className="section-title">Our Leadership Team</h2>
          <div className="grid grid-4">
            {team.map(member => (
              <div key={member.id} className="team-card">
                <div className="team-avatar"><FaUserTie size={50} /></div>
                <h3>{member.name}</h3>
                <p className="position">{member.position}</p>
                <p className="bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="container">
          <h2 className="section-title">By The Numbers</h2>
          <div className="grid grid-4">
            <div className="stat-card">
              <div className="stat-number">100K+</div>
              <p>Happy Customers</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <p>Countries Served</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">25+</div>
              <p>Premium Products</p>
            </div>
            <div className="stat-card">
              <div className="stat-number">99.8%</div>
              <p>Customer Satisfaction</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
