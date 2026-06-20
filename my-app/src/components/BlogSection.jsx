import { Link } from "react-router-dom";
import { FiArrowRight, FiClock, FiUser } from "react-icons/fi";
import { blogArticles } from "../data/seed";
import { blogImages } from "../data/blogImages";
import "./BlogSection.css";

const BLOG_SLUGS = [
  "bcaas-liver-health-cirrhosis-management",
  "mct-oil-kids-weight-gain-nutritional-support",
  "folic-acid-vs-l-methylfolate-pregnancy",
];

const ARTICLE_SLUGS = [
  "maternal-nutrition-prenatal-postnatal-care",
  "pediatric-health-growth-milestones-infant-nutrition",
  "immune-support-vitamins-minerals-immune-response",
];

const bySlugs = (slugs) =>
  slugs
    .map((slug) => blogArticles.find((a) => a.slug === slug))
    .filter(Boolean);

function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.slug}`} className="hbs-card">
      <div className="hbs-card__img">
        <img src={blogImages[post.slug]} alt={post.title} loading="lazy" />
        <span className="hbs-card__cat" style={{ background: post.categoryColor }}>
          {post.category}
        </span>
      </div>
      <div className="hbs-card__body">
        <h4 className="hbs-card__title">{post.title}</h4>
        <p className="hbs-card__excerpt">{post.metaDescription}</p>
        <div className="hbs-card__meta">
          <span>
            <FiUser size={12} /> {post.author}
          </span>
          <span className="hbs-card__dot">·</span>
          <span>
            <FiClock size={12} /> {post.readTime}
          </span>
        </div>
        <span className="hbs-card__link">
          Read article <FiArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}

export default function BlogSection() {
  const blogs = bySlugs(BLOG_SLUGS);
  const articles = bySlugs(ARTICLE_SLUGS);

  return (
    <section className="hbs-section">
      <div className="hbs-container">
        <div className="hbs-head">
          <span className="hbs-eyebrow">From the Blog</span>
          <h2 className="hbs-title">Latest blogs, stay updated</h2>
          <p className="hbs-lede">
            Research-backed nutrition insights, delivered regularly — from liver
            and maternal health to pediatric nutrition and immune support.
          </p>
          <Link to="/blogs" className="hbs-cta">
            Check our blogs <FiArrowRight size={15} />
          </Link>
        </div>

        <div className="hbs-group">
          <h3 className="hbs-group-title">Blogs</h3>
          <div className="hbs-grid">
            {blogs.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="hbs-group">
          <h3 className="hbs-group-title">Articles</h3>
          <div className="hbs-grid">
            {articles.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
