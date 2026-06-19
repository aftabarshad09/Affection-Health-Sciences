import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBook } from 'react-icons/fa';
import Hero from '../components/Hero';
import { blogArticles } from '../data/seed';
import { blogImages } from '../data/blogImages';
import '../style/Blogs.css';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Articles' },
    ...[...new Set(blogArticles.map((a) => a.category))].map((cat) => ({
      id: cat,
      label: cat,
    })),
  ];

  const filteredBlogs =
    selectedCategory === 'all'
      ? blogArticles
      : blogArticles.filter((a) => a.category === selectedCategory);

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
            {categories.map((cat) => (
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
            {filteredBlogs.map((blog) => (
              <article key={blog.slug} className="blog-card">
                <div className="blog-image">
                  <img src={blogImages[blog.slug]} alt={blog.title} />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span
                      className="blog-category"
                      style={{ background: blog.categoryColor, color: '#fff' }}
                    >
                      {blog.category}
                    </span>
                    <span className="blog-date">{formatDate(blog.date)}</span>
                  </div>
                  <h3 className="blog-title">{blog.title}</h3>
                  <p className="blog-excerpt">{blog.metaDescription}</p>
                  <div className="blog-footer">
                    <div className="blog-author">
                      <span className="author-avatar">👤</span>
                      <div className="author-info">
                        <p className="author-name">{blog.author}</p>
                        <p className="read-time">{blog.readTime}</p>
                      </div>
                    </div>
                    <Link to={`/blog/${blog.slug}`} className="read-more-link">
                      Read More →
                    </Link>
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
