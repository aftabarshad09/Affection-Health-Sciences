import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: 'Fitness Enthusiast',
      content: 'NutriFactor\'s supplements have transformed my fitness journey. The quality is outstanding and I\'ve noticed real results within weeks!',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Health Coach',
      content: 'I recommend NutriFactor to all my clients. Their science-backed approach and premium ingredients set them apart from competitors.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emma Rodriguez',
      role: 'Wellness Blogger',
      content: 'Finally found supplements I trust completely. The transparency about sourcing and testing gives me confidence in every product.',
      rating: 5
    },
    {
      id: 4,
      name: 'James Patterson',
      role: 'Athlete',
      content: 'As an athlete, I need supplements I can trust. NutriFactor delivers quality, consistency, and real results every time.',
      rating: 5
    }
  ];

  return (
    <div className="testimonials-container">
      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar"><FaUserCircle size={50} /></div>
              <div className="author-info">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.role}</p>
              </div>
            </div>
            <div className="rating">
              {'⭐'.repeat(testimonial.rating)}
            </div>
            <p className="testimonial-content">"{testimonial.content}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
