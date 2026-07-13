import { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    fetch('/api/reviews?featured=true')
      .then((res) => res.json())
      .then((data) => { if (data.success) setTestimonials(data.reviews); })
      .catch(() => {});
  }, []);

  return (
    <div className="testimonials-container">
      <div className="testimonials-grid">
        {testimonials.map(testimonial => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="testimonial-header">
              <div className="avatar"><FaUserCircle size={50} /></div>
              <div className="author-info">
                <h4>{testimonial.name}</h4>
                <p>{testimonial.location}</p>
              </div>
            </div>
            <div className="rating">
              {'⭐'.repeat(testimonial.rating)}
            </div>
            <p className="testimonial-content">"{testimonial.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
