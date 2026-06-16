import React, { useState } from 'react';
import { FaDna, FaDumbbell, FaYinYang, FaBook } from 'react-icons/fa';
import Hero from '../components/Hero';
import '../style/Blogs.css';

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogs = [
    {
      id: 1,
      title: 'The Ultimate Guide to Zinc Supplementation',
      category: 'nutrition',
      date: 'June 1, 2024',
      author: 'Dr. Sarah Johnson',
      excerpt: 'Discover how zinc supports immune function, wound healing, and metabolic health.',
      image: '💊',
      readTime: '8 min read'
    },
    {
      id: 2,
      title: 'Magnesium: The Mineral for Better Sleep',
      category: 'wellness',
      date: 'May 28, 2024',
      author: 'Dr. Michael Chen',
      excerpt: 'Learn why magnesium is crucial for sleep quality and how to optimize your intake.',
      image: '😴',
      readTime: '6 min read'
    },
    {
      id: 3,
      title: 'Vitamin D Deficiency: Symptoms and Solutions',
      category: 'health',
      date: 'May 25, 2024',
      author: 'Emily Williams',
      excerpt: 'Understanding vitamin D deficiency and practical strategies to maintain healthy levels.',
      image: '🌞',
      readTime: '7 min read'
    },
    {
      id: 4,
      title: 'Omega-3s: Essential Fats for Heart and Brain',
      category: 'nutrition',
      date: 'May 20, 2024',
      author: 'Dr. Sarah Johnson',
      excerpt: 'Explore the science behind omega-3 fatty acids and their critical role in health.',
      image: '🐟',
      readTime: '9 min read'
    },
    {
      id: 5,
      title: 'Gut Health: The Foundation of Wellness',
      category: 'wellness',
      date: 'May 15, 2024',
      author: 'Dr. Michael Chen',
      excerpt: 'Why gut health matters and how probiotics can transform your digestive system.',
      image: '🦠',
      readTime: '8 min read'
    },
    {
      id: 6,
      title: 'Natural Energy Boosters Without Caffeine',
      category: 'health',
      date: 'May 10, 2024',
      author: 'James Martinez',
      excerpt: 'Combat fatigue naturally with supplements and lifestyle changes recommended by experts.',
      image: '⚡',
      readTime: '5 min read'
    },
    {
      id: 7,
      title: 'Collagen for Skin, Hair, and Joints',
      category: 'beauty',
      date: 'May 5, 2024',
      author: 'Emily Williams',
      excerpt: 'How collagen supplementation can enhance your beauty and mobility naturally.',
      image: '✨',
      readTime: '6 min read'
    },
    {
      id: 8,
      title: 'Anti-Inflammatory Foods and Supplements',
      category: 'nutrition',
      date: 'April 30, 2024',
      author: 'Dr. Sarah Johnson',
      excerpt: 'Reduce inflammation naturally with proven supplements and dietary strategies.',
      image: '🌱',
      readTime: '7 min read'
    },
    {
      id: 9,
      title: 'Women\'s Health: Essential Supplements Guide',
      category: 'health',
      date: 'April 25, 2024',
      author: 'Emily Williams',
      excerpt: 'Key supplements every woman should consider for hormonal and overall health.',
      image: '👩',
      readTime: '8 min read'
    }
  ];

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(b => b.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Articles' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'wellness', label: 'Wellness' },
    { id: 'health', label: 'Health' },
    { id: 'beauty', label: 'Beauty' }
  ];

  return (
    <div className="blogs-page">
      <Hero 
        title="Wellness Blogs" 
        subtitle="Expert insights on nutrition, health, and wellness"
        Icon={FaBook}
      />

      {/* Blog Articles */}
      <section className="blogs-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Articles</h2>
            <p>Learn from experts about nutrition and wellness</p>
          </div>

          {/* Category Filter */}
          <div className="blog-filter">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Blog Grid */}
          <div className="blogs-grid">
            {filteredBlogs.map(blog => (
              <article key={blog.id} className="blog-card">
                <div className="blog-image">{blog.image}</div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-category">{blog.category}</span>
                    <span className="blog-date">{blog.date}</span>
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <div className="blog-footer">
                    <div className="blog-author">
                      <span className="author-avatar">👤</span>
                      <div className="author-info">
                        <p className="author-name">{blog.author}</p>
                        <p className="read-time">{blog.readTime}</p>
                      </div>
                    </div>
                    <a href="#" className="read-more-link">Read More →</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="featured-topics light-bg">
        <div className="container">
          <h2 className="section-title">Popular Topics</h2>
          <div className="grid grid-3">
            <div className="topic-card">
              <div className="topic-icon">🧬</div>
              <h3>Nutrition Science</h3>
              <p>Deep dives into nutritional science and research-backed health benefits.</p>
              <a href="#">Explore →</a>
            </div>
            <div className="topic-card">
              <div className="topic-icon">🏋️</div>
              <h3>Fitness & Supplements</h3>
              <p>Optimize your fitness goals with the right supplements and nutrition.</p>
              <a href="#">Explore →</a>
            </div>
            <div className="topic-card">
              <div className="topic-icon">🧘</div>
              <h3>Wellness Lifestyle</h3>
              <p>Holistic approaches to health including nutrition, exercise, and mindfulness.</p>
              <a href="#">Explore →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Tips */}
      <section className="expert-tips">
        <div className="container">
          <h2 className="section-title">Expert Tips</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-number">01</div>
              <h4>Consistency is Key</h4>
              <p>Take supplements consistently as directed for best results. Most supplements require 4-12 weeks to show noticeable effects.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">02</div>
              <h4>Quality Matters</h4>
              <p>Choose supplements from reputable brands that conduct third-party testing and provide transparency about ingredients.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">03</div>
              <h4>Consult Professionals</h4>
              <p>Before starting any supplement regimen, consult with healthcare professionals to ensure compatibility with your health status.</p>
            </div>
            <div className="tip-card">
              <div className="tip-number">04</div>
              <h4>Combine with Lifestyle</h4>
              <p>Supplements work best when combined with healthy eating, regular exercise, adequate sleep, and stress management.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="blog-newsletter light-bg">
        <div className="container">
          <div className="newsletter-content">
            <h2>Subscribe to Our Newsletter</h2>
            <p>Get expert wellness tips and latest articles delivered to your inbox</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
