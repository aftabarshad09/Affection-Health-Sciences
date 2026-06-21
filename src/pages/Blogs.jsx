import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiClock,
  FiUser,
  FiSearch,
  FiBookOpen,
  FiHeart,
  FiStar,
  FiTrendingUp,
  FiCheckCircle,
  FiMail,
  FiChevronRight,
} from 'react-icons/fi';
import { blogArticles } from '../data/seed';
import { blogImages } from '../data/blogImages';
import heroVideo from '../assets/videos/blogs.mp4';
import '../style/Blogs.css';

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

/* Scroll-reveal hook */
function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setShown(true),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, shown];
}

const TOPICS = [
  {
    title: 'Maternal Nutrition',
    desc: 'Evidence-based guidance for prenatal and postnatal care — what to supplement and why.',
    img: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80',
    icon: FiHeart,
    slug: 'maternal-nutrition-prenatal-postnatal-care',
  },
  {
    title: 'Pediatric Health',
    desc: 'Growth milestones, infant nutrition, and trusted supplementation for early development.',
    img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80',
    icon: FiStar,
    slug: 'pediatric-health-growth-milestones-infant-nutrition',
  },
  {
    title: 'Immune Support',
    desc: 'How vitamins, minerals, and targeted formulas support your immune response year-round.',
    img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
    icon: FiTrendingUp,
    slug: 'immune-support-vitamins-minerals-immune-response',
  },
];

const TIPS = [
  { title: 'Consistency over intensity', body: 'Supplements work cumulatively — daily adherence over 4–12 weeks matters more than doubling the dose once.' },
  { title: 'Read what you take', body: 'Transparent labels, third-party testing, and no proprietary blends. If the brand won\'t tell you what\'s inside, move on.' },
  { title: 'Talk to your clinician', body: 'Before starting any formula, discuss it with your healthcare provider — especially during pregnancy or alongside medication.' },
  { title: 'Food first, supplement second', body: 'Supplements fill gaps in an already balanced diet. They\'re not replacements for whole foods, sleep, or exercise.' },
];

const Blogs = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState('idle');
  const [scrollY, setScrollY] = useState(0);

  const [articlesRef, articlesShown] = useReveal();
  const [topicsRef, topicsShown] = useReveal();
  const [tipsRef, tipsShown] = useReveal();

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setNewsletterStatus('submitting');
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed');
      setNewsletterStatus('done');
      setNewsletterEmail('');
    } catch {
      setNewsletterStatus('idle');
    }
  };

  const categories = [
    { id: 'all', label: 'All' },
    ...[...new Set(blogArticles.map((a) => a.category))].map((cat) => ({
      id: cat,
      label: cat,
    })),
  ];

  const filtered = blogArticles.filter((a) => {
    const matchesCat = selectedCategory === 'all' || a.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.metaDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const featured = blogArticles[0];
  const remaining = filtered.slice(0);

  return (
    <main className="bp-page">
      {/* ========== HERO ========== */}
      <section className="bp-hero">
        <div className="bp-hero__media" aria-hidden="true">
          <video className="bp-hero__video" autoPlay muted loop playsInline>
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="bp-hero__scrim" />
        </div>
        <div className="bp-hero__content">
          <span className="bp-hero__eyebrow">
            <FiBookOpen size={14} /> Wellness Blog
          </span>
          <h1 className="bp-hero__title">
            Insights that inform,
            <br />
            not just impress.
          </h1>
          <p className="bp-hero__lede">
            Research-backed articles on nutrition, formulation science, and the
            honest questions behind what you take every day.
          </p>
        </div>
        <div className="bp-hero__scroll-hint" aria-hidden="true">
          <span /> Scroll
        </div>
      </section>

      {/* ========== FEATURED ARTICLE ========== */}
      <section className="bp-featured">
        <div className="bp-container">
          <div className="bp-featured__card">
            <div className="bp-featured__img">
              <img src={blogImages[featured.slug]?.hero} alt={featured.title} loading="lazy" />
              <span className="bp-featured__badge">Featured</span>
            </div>
            <div className="bp-featured__body">
              <div className="bp-featured__meta">
                <span className="bp-featured__cat" style={{ background: featured.categoryColor }}>
                  {featured.category}
                </span>
                <span className="bp-featured__date">
                  <FiClock size={13} /> {formatDate(featured.date)}
                </span>
              </div>
              <h2 className="bp-featured__title">{featured.title}</h2>
              <p className="bp-featured__excerpt">{featured.metaDescription}</p>
              <div className="bp-featured__footer">
                <div className="bp-featured__author">
                  <FiUser size={14} />
                  <span>{featured.author}</span>
                  <span className="bp-featured__dot">·</span>
                  <span>{featured.readTime}</span>
                </div>
                <Link to={`/blog/${featured.slug}`} className="bp-featured__link">
                  Read article <FiArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== ARTICLES GRID ========== */}
      <section ref={articlesRef} className={`bp-articles ${articlesShown ? 'is-shown' : ''}`}>
        <div className="bp-container">
          <div className="bp-articles__head">
            <div>
              <span className="bp-eyebrow">Articles</span>
              <h2 className="bp-h2">Latest from the blog</h2>
            </div>
            <div className="bp-articles__search">
              <FiSearch className="bp-articles__search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bp-filter">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`bp-filter__btn glass-btn ${selectedCategory === cat.id ? 'bp-active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="bp-grid">
            {remaining.length === 0 && (
              <p className="bp-grid__empty">No articles match your search.</p>
            )}
            {remaining.map((blog) => (
              <article key={blog.slug} className="bp-card">
                <div className="bp-card__img">
                  <img src={blogImages[blog.slug]?.hero} alt={blog.title} loading="lazy" />
                </div>
                <div className="bp-card__body">
                  <div className="bp-card__meta">
                    <span className="bp-card__cat" style={{ background: blog.categoryColor }}>
                      {blog.category}
                    </span>
                    <span className="bp-card__date">{formatDate(blog.date)}</span>
                  </div>
                  <h3 className="bp-card__title">{blog.title}</h3>
                  <p className="bp-card__excerpt">{blog.metaDescription}</p>
                  <div className="bp-card__footer">
                    <div className="bp-card__author">
                      <FiUser size={13} />
                      <span>{blog.author}</span>
                      <span className="bp-card__dot">·</span>
                      <span><FiClock size={12} /> {blog.readTime}</span>
                    </div>
                    <Link to={`/blog/${blog.slug}`} className="bp-card__link">
                      Read <FiChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PARALLAX BREAK ========== */}
      <div className="bp-parallax" aria-hidden="true">
        <div
          className="bp-parallax__img"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1600&q=80')",
            transform: `translateY(${scrollY * 0.04}px)`,
          }}
        />
        <div className="bp-parallax__quote">
          <p>"The best supplement is the one backed by evidence — not the one backed by the loudest marketing."</p>
        </div>
      </div>

      {/* ========== POPULAR TOPICS ========== */}
      <section ref={topicsRef} className={`bp-topics ${topicsShown ? 'is-shown' : ''}`}>
        <div className="bp-container">
          <span className="bp-eyebrow">Explore</span>
          <h2 className="bp-h2">Popular topics</h2>
          <div className="bp-topics__grid">
            {TOPICS.map((t) => (
              <article className="bp-topic" key={t.title}>
                <div className="bp-topic__img">
                  <img src={t.img} alt={t.title} loading="lazy" />
                  <div className="bp-topic__icon-wrap">
                    <t.icon size={20} />
                  </div>
                </div>
                <div className="bp-topic__body">
                  <h3 className="bp-topic__title">{t.title}</h3>
                  <p className="bp-topic__desc">{t.desc}</p>
                  <Link to={`/blog/${t.slug}`} className="bp-topic__link">
                    Explore articles <FiArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== EXPERT TIPS ========== */}
      <section ref={tipsRef} className={`bp-tips ${tipsShown ? 'is-shown' : ''}`}>
        <div className="bp-container">
          <span className="bp-eyebrow">From our team</span>
          <h2 className="bp-h2">Expert tips</h2>
          <div className="bp-tips__grid">
            {TIPS.map((tip, i) => (
              <article className="bp-tip" key={tip.title} style={{ transitionDelay: `${i * 70}ms` }}>
                <FiCheckCircle className="bp-tip__icon" />
                <h4 className="bp-tip__title">{tip.title}</h4>
                <p className="bp-tip__body">{tip.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="bp-newsletter">
        <div className="bp-newsletter__glow" aria-hidden="true" />
        <div className="bp-container bp-newsletter__inner">
          <div className="bp-newsletter__copy">
            <span className="bp-eyebrow bp-eyebrow--light">Newsletter</span>
            <h2 className="bp-newsletter__title">Stay in the loop</h2>
            <p className="bp-newsletter__lede">
              New articles, formulation deep-dives, and wellness insights — delivered,
              never spammed.
            </p>
          </div>
          <form className="bp-newsletter__form" onSubmit={handleNewsletterSubmit} noValidate>
            <div className="bp-newsletter__input-wrap">
              <FiMail className="bp-newsletter__input-icon" aria-hidden="true" />
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={newsletterStatus !== 'idle'}
              />
            </div>
            <button type="submit" className="bp-newsletter__submit glass-btn" disabled={newsletterStatus !== 'idle'}>
              {newsletterStatus === 'done' ? 'Subscribed' : newsletterStatus === 'submitting' ? 'Sending...' : 'Subscribe'}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Blogs;