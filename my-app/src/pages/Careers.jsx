import React, { useState } from 'react';
import { FaRocket, FaHospital, FaBook as FaLearning, FaHome, FaMoneyBill, FaUsers, FaUserTie, FaChartLine, FaCheckCircle } from 'react-icons/fa';
import Hero from '../components/Hero';
import '../style/Careers.css';

const Careers = () => {
  const [selectedDept, setSelectedDept] = useState('all');

  const jobs = [
    {
      id: 1,
      title: 'Senior Nutritionist',
      department: 'nutrition',
      location: 'New York, USA',
      type: 'Full-time',
      experience: '5+ years',
      description: 'Lead our nutrition research team and develop innovative supplement formulations.'
    },
    {
      id: 2,
      title: 'Product Manager',
      department: 'product',
      location: 'San Francisco, USA',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Manage product development from concept to market launch.'
    },
    {
      id: 3,
      title: 'Quality Assurance Specialist',
      department: 'quality',
      location: 'Boston, USA',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Ensure all products meet our strict quality standards and regulations.'
    },
    {
      id: 4,
      title: 'Marketing Specialist',
      department: 'marketing',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Create compelling marketing campaigns for our nutrition brand.'
    },
    {
      id: 5,
      title: 'Sales Representative',
      department: 'sales',
      location: 'Multiple Locations',
      type: 'Full-time',
      experience: '1+ years',
      description: 'Build relationships with retailers and distributors to grow our market presence.'
    },
    {
      id: 6,
      title: 'Research Scientist',
      department: 'nutrition',
      location: 'New York, USA',
      type: 'Full-time',
      experience: '3+ years',
      description: 'Conduct research on nutritional science and supplement efficacy.'
    },
    {
      id: 7,
      title: 'Customer Service Manager',
      department: 'support',
      location: 'Remote',
      type: 'Full-time',
      experience: '2+ years',
      description: 'Lead and manage our customer support team to ensure excellence.'
    },
    {
      id: 8,
      title: 'Supply Chain Manager',
      department: 'operations',
      location: 'Chicago, USA',
      type: 'Full-time',
      experience: '4+ years',
      description: 'Optimize our supply chain and manage vendor relationships.'
    }
  ];

  const departments = [
    { id: 'all', name: 'All Departments' },
    { id: 'nutrition', name: 'Nutrition & Research' },
    { id: 'product', name: 'Product Development' },
    { id: 'quality', name: 'Quality Assurance' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'sales', name: 'Sales' },
    { id: 'support', name: 'Customer Support' },
    { id: 'operations', name: 'Operations' }
  ];

  const filteredJobs = selectedDept === 'all' 
    ? jobs 
    : jobs.filter(j => j.department === selectedDept);

  const benefits = [
    { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive health, dental, and vision coverage' },
    { icon: '📚', title: 'Learning & Development', desc: 'Continuous professional development opportunities' },
    { icon: '🏠', title: 'Flexible Work', desc: 'Remote and flexible working arrangements' },
    { icon: '💰', title: 'Competitive Salary', desc: 'Industry-leading compensation packages' },
    { icon: '🏖️', title: 'Generous PTO', desc: '25+ days of paid time off annually' },
    { icon: '🎯', title: 'Growth Opportunities', desc: 'Clear career advancement pathways' },
    { icon: '🤝', title: 'Team Culture', desc: 'Collaborative and supportive work environment' },
    { icon: '🎁', title: 'Wellness Benefits', desc: 'Free NutriFactor products and gym memberships' }
  ];

  return (
    <div className="careers-page">
      <Hero 
        title="Join Our Team" 
        subtitle="Help us revolutionize the nutrition industry"
        Icon={FaRocket}
      />

      {/* About Working Here */}
      <section className="why-join">
        <div className="container">
          <div className="section-header">
            <h2>Why Join NutriFactor?</h2>
            <p>Be part of a team that's changing lives through nutrition</p>
          </div>
          <div className="grid grid-2">
            <div className="why-box">
              <h3>Our Mission</h3>
              <p>
                We're on a mission to make premium nutrition accessible to everyone. When you join NutriFactor, you become part of a movement that impacts millions of lives globally.
              </p>
            </div>
            <div className="why-box">
              <h3>Our Culture</h3>
              <p>
                We believe in innovation, transparency, and putting people first. Our team is passionate, diverse, and committed to excellence in everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="benefits-section light-bg">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="benefits-grid">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h4>{benefit.title}</h4>
                <p>{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="open-positions">
        <div className="container">
          <div className="section-header">
            <h2>Open Positions</h2>
            <p>Find your next opportunity with NutriFactor</p>
          </div>

          {/* Department Filter */}
          <div className="dept-filter">
            {departments.map(dept => (
              <button
                key={dept.id}
                className={`dept-btn ${selectedDept === dept.id ? 'active' : ''}`}
                onClick={() => setSelectedDept(dept.id)}
              >
                {dept.name}
              </button>
            ))}
          </div>

          {/* Job Listings */}
          <div className="jobs-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map(job => (
                <div key={job.id} className="job-card">
                  <div className="job-header">
                    <div>
                      <h3>{job.title}</h3>
                      <p className="job-department">{job.department}</p>
                    </div>
                    <a href="#apply" className="apply-btn">Apply Now</a>
                  </div>
                  <div className="job-details">
                    <div className="job-detail">
                      <span className="detail-label">📍 Location:</span>
                      <span>{job.location}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-label">⏰ Type:</span>
                      <span>{job.type}</span>
                    </div>
                    <div className="job-detail">
                      <span className="detail-label">📊 Experience:</span>
                      <span>{job.experience}</span>
                    </div>
                  </div>
                  <p className="job-description">{job.description}</p>
                </div>
              ))
            ) : (
              <p className="no-jobs">No positions available in this department currently.</p>
            )}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="team-highlights light-bg">
        <div className="container">
          <h2 className="section-title">Meet Our Team</h2>
          <div className="team-stats">
            <div className="stat">
              <h3>500+</h3>
              <p>Team Members Worldwide</p>
            </div>
            <div className="stat">
              <h3>30+</h3>
              <p>Countries Represented</p>
            </div>
            <div className="stat">
              <h3>95%</h3>
              <p>Employee Satisfaction</p>
            </div>
            <div className="stat">
              <h3>4.8/5</h3>
              <p>Company Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interview Process */}
      <section className="process">
        <div className="container">
          <h2 className="section-title">Our Interview Process</h2>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Application Review</h4>
              <p>We review your resume and cover letter to understand your fit.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Phone Screening</h4>
              <p>Initial conversation to discuss your background and the role.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Technical/Skill Test</h4>
              <p>Assessment relevant to the position requirements.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>Team Interview</h4>
              <p>Meet with team members and learn about the company culture.</p>
            </div>
            <div className="step-arrow">→</div>
            <div className="step">
              <div className="step-number">5</div>
              <h4>Offer & Onboarding</h4>
              <p>Receive offer and join our amazing team!</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="careers-cta light-bg">
        <div className="container">
          <div className="cta-content">
            <h2>Don't See Your Dream Role?</h2>
            <p>Submit your resume for future opportunities</p>
            <button className="btn btn-primary">Submit Your Resume</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Careers;
