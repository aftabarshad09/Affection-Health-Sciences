import { useState, useEffect, useRef } from 'react';
import {
  FaStar,
  FaRegStar,
  FaQuoteLeft,
  FaCheckCircle,
  FaUserCircle,
} from 'react-icons/fa';
import {
  FiThumbsUp,
  FiArrowRight,
  FiShield,
  FiAward,
  FiUsers,
  FiHeart,
  FiPackage,
  FiFilter,
} from 'react-icons/fi';
import '../style/Reviews.css';

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

const overallStats = {
  average: 4.8,
  totalReviews: 1248,
  recommendPercent: 97,
};

const ratingBreakdown = [
  { stars: 5, percent: 82 },
  { stars: 4, percent: 12 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
];

const featuredReview = {
  name: 'Ayesha Raza',
  location: 'Lahore, Pakistan',
  product: 'Gynogid Forte — Prenatal Supplement',
  rating: 5,
  text: "I started Gynogid Forte in my second trimester after my OB recommended a better folate source. No more nausea after meals, and my last bloodwork came back exactly where it needed to be. Genuinely grateful I found this brand.",
};

const reviews = [
  {
    id: 1,
    name: 'Sana Malik',
    location: 'Karachi, Pakistan',
    product: 'Hepatovital — Liver Support',
    rating: 5,
    date: 'March 14, 2026',
    verified: true,
    helpful: 34,
    title: 'Noticeable energy improvement within weeks',
    text: "My father has been managing cirrhosis for two years, and his hepatologist suggested adding a BCAA supplement. Hepatovital mixes easily and he actually tolerates the vanilla flavor well. His energy and appetite have both improved.",
  },
  {
    id: 2,
    name: 'Bilal Ahmed',
    location: 'Islamabad, Pakistan',
    product: 'ENERGID PLUS — Adult Nutrition',
    rating: 5,
    date: 'February 28, 2026',
    verified: true,
    helpful: 21,
    title: 'Got my mother through post-surgery recovery',
    text: "After my mother's surgery, she had almost no appetite. ENERGID PLUS became her main source of nutrition for nearly three weeks. The chocolate flavor was the only thing she'd actually finish without complaining. Huge relief for our whole family.",
  },
  {
    id: 3,
    name: 'Fatima Sheikh',
    location: 'Lahore, Pakistan',
    product: 'Mctolip — MCT Oil for Kids',
    rating: 4,
    date: 'February 19, 2026',
    verified: true,
    helpful: 17,
    title: 'Helped, though it took some patience',
    text: "My toddler is a notoriously picky eater and was falling behind on his growth chart. We started mixing a small amount of Mctolip into his yogurt. It took about three weeks before our pediatrician noted real improvement, but it's working. Wish it came in a bigger bottle.",
  },
  {
    id: 4,
    name: 'Hamza Tariq',
    location: 'Faisalabad, Pakistan',
    product: 'Gynogid Forte — Prenatal Supplement',
    rating: 5,
    date: 'January 30, 2026',
    verified: true,
    helpful: 29,
    title: "My wife's go-to prenatal",
    text: "Bought this for my wife after a friend recommended it. She liked that everything — folic acid, DHA, calcium, iron — was in one scoop instead of five different pills. Easier to stay consistent with, which honestly matters more than anything fancy on the label.",
  },
  {
    id: 5,
    name: 'Mariam Yousuf',
    location: 'Rawalpindi, Pakistan',
    product: 'Hepatovital — Liver Support',
    rating: 5,
    date: 'January 12, 2026',
    verified: true,
    helpful: 12,
    title: 'Customer support was excellent too',
    text: "Beyond the product itself, I want to mention the support team — I had questions about dosing alongside my mother's other medication and they responded quickly and pointed me back to her doctor appropriately instead of guessing. That kind of caution builds real trust.",
  },
  {
    id: 6,
    name: 'Usman Qureshi',
    location: 'Multan, Pakistan',
    product: 'ENERGID PLUS — Adult Nutrition',
    rating: 4,
    date: 'December 22, 2025',
    verified: false,
    helpful: 8,
    title: 'Good product, shipping took a while',
    text: "The supplement itself is solid — my father uses it as a meal supplement around his COPD treatment and it's helped him maintain his weight. Only complaint is that delivery to Multan took almost ten days. Otherwise, would recommend.",
  },
];

const TRUST_SIGNALS = [
  {
    icon: FiShield,
    title: 'Third-party tested',
    body: 'Every batch verified by independent labs for potency, purity, and contaminants before it ships.',
  },
  {
    icon: FiAward,
    title: 'Clinician-reviewed',
    body: 'Formulations developed alongside healthcare professionals — not assembled from a trend list.',
  },
  {
    icon: FiUsers,
    title: '1,200+ families',
    body: 'Real families across Pakistan trusting our products for hepatic, maternal, pediatric, and immune support.',
  },
];

const TOP_PRODUCTS = [
  {
    name: 'Gynogid Forte',
    category: 'Maternal',
    rating: 4.9,
    reviewCount: 412,
    icon: FiHeart,
  },
  {
    name: 'Hepatovital',
    category: 'Hepatic Support',
    rating: 4.8,
    reviewCount: 338,
    icon: FiPackage,
  },
  {
    name: 'ENERGID PLUS',
    category: 'Adult Nutrition',
    rating: 4.7,
    reviewCount: 276,
    icon: FiAward,
  },
];

const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) =>
    i < rating ? (
      <FaStar key={i} className="rv-star rv-star--filled" />
    ) : (
      <FaRegStar key={i} className="rv-star" />
    )
  );

const Reviews = () => {
  const [helpfulClicks, setHelpfulClicks] = useState({});
  const [filterRating, setFilterRating] = useState('all');

  const [breakdownRef, breakdownShown] = useReveal();
  const [trustRef, trustShown] = useReveal();
  const [gridRef, gridShown] = useReveal();
  const [productsRef, productsShown] = useReveal();

  const markHelpful = (id) => {
    setHelpfulClicks((prev) => ({ ...prev, [id]: true }));
  };

  const filteredReviews =
    filterRating === 'all'
      ? reviews
      : reviews.filter((r) => r.rating === Number(filterRating));

  return (
    <main className="rv-page">
      {/* ========== HERO ========== */}
      <section className="rv-hero">
        <div className="rv-hero__bg" aria-hidden="true">
          <div className="rv-hero__glow rv-hero__glow--one" />
          <div className="rv-hero__glow rv-hero__glow--two" />
        </div>

        <div className="rv-hero__content">
          <span className="rv-hero__eyebrow">Customer Reviews</span>
          <h1 className="rv-hero__title">What our customers are saying</h1>
          <p className="rv-hero__subtitle">
            Real experiences from real families — on liver support, maternal
            nutrition, pediatric care, and everyday wellness.
          </p>

          <div className="rv-hero__summary">
            <div className="rv-hero__stat">
              <span className="rv-hero__stat-number">{overallStats.average}</span>
              <div>
                <div className="rv-hero__stars">{renderStars(5)}</div>
                <span className="rv-hero__stat-label">
                  Based on {overallStats.totalReviews.toLocaleString()} reviews
                </span>
              </div>
            </div>
            <div className="rv-hero__divider" aria-hidden="true" />
            <div className="rv-hero__stat">
              <span className="rv-hero__stat-number">{overallStats.recommendPercent}%</span>
              <span className="rv-hero__stat-label">of customers recommend us</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== RATING BREAKDOWN + FEATURED ========== */}
      <section
        ref={breakdownRef}
        className={`rv-breakdown ${breakdownShown ? 'is-shown' : ''}`}
      >
        <div className="rv-container">
          <div className="rv-breakdown__grid">
            <div className="rv-breakdown__bars">
              <span className="rv-eyebrow">Rating breakdown</span>
              <h2 className="rv-h2">By the numbers</h2>
              {ratingBreakdown.map((r) => (
                <div className="rv-breakdown__row" key={r.stars}>
                  <span className="rv-breakdown__label">{r.stars} star</span>
                  <div className="rv-breakdown__track">
                    <div
                      className="rv-breakdown__fill"
                      style={{ width: breakdownShown ? `${r.percent}%` : '0%' }}
                    />
                  </div>
                  <span className="rv-breakdown__percent">{r.percent}%</span>
                </div>
              ))}
            </div>

            <div className="rv-breakdown__featured">
              <FaQuoteLeft className="rv-breakdown__quote-icon" />
              <p className="rv-breakdown__featured-text">{featuredReview.text}</p>
              <div className="rv-breakdown__featured-stars">
                {renderStars(featuredReview.rating)}
              </div>
              <div className="rv-breakdown__featured-author">
                <FaUserCircle size={36} />
                <div>
                  <strong>{featuredReview.name}</strong>
                  <span>{featuredReview.location}</span>
                  <span className="rv-breakdown__featured-product">
                    {featuredReview.product}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== TRUST SIGNALS (NEW) ========== */}
      <section
        ref={trustRef}
        className={`rv-trust ${trustShown ? 'is-shown' : ''}`}
      >
        <div className="rv-container">
          <span className="rv-eyebrow">Why families trust us</span>
          <h2 className="rv-h2">Built on evidence, not just endorsements</h2>
          <div className="rv-trust__grid">
            {TRUST_SIGNALS.map((t, i) => (
              <article className="rv-trust__card" key={t.title} style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="rv-trust__icon">
                  <t.icon size={22} />
                </div>
                <h3 className="rv-trust__card-title">{t.title}</h3>
                <p className="rv-trust__card-body">{t.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== REVIEWS GRID ========== */}
      <section
        ref={gridRef}
        className={`rv-list ${gridShown ? 'is-shown' : ''}`}
      >
        <div className="rv-container">
          <div className="rv-list__head">
            <div>
              <span className="rv-eyebrow">Reviews</span>
              <h2 className="rv-h2">From our customers</h2>
            </div>
            <div className="rv-list__filter">
              <FiFilter size={14} className="rv-list__filter-icon" />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="rv-list__select"
              >
                <option value="all">All ratings</option>
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
              </select>
            </div>
          </div>

          <div className="rv-grid">
            {filteredReviews.length === 0 && (
              <p className="rv-grid__empty">No reviews match this filter.</p>
            )}
            {filteredReviews.map((review) => (
              <article className="rv-card" key={review.id}>
                <div className="rv-card__head">
                  <div className="rv-card__avatar">
                    <FaUserCircle size={38} />
                  </div>
                  <div className="rv-card__identity">
                    <div className="rv-card__name-row">
                      <strong>{review.name}</strong>
                      {review.verified && (
                        <span className="rv-card__verified">
                          <FaCheckCircle size={11} /> Verified
                        </span>
                      )}
                    </div>
                    <span className="rv-card__location">{review.location}</span>
                  </div>
                </div>

                <div className="rv-card__stars">{renderStars(review.rating)}</div>
                <h3 className="rv-card__title">{review.title}</h3>
                <p className="rv-card__product">{review.product}</p>
                <p className="rv-card__text">{review.text}</p>

                <div className="rv-card__footer">
                  <span className="rv-card__date">{review.date}</span>
                  <button
                    type="button"
                    className={`rv-card__helpful ${helpfulClicks[review.id] ? 'rv-active' : ''}`}
                    onClick={() => markHelpful(review.id)}
                  >
                    <FiThumbsUp size={13} />
                    Helpful ({review.helpful + (helpfulClicks[review.id] ? 1 : 0)})
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TOP-RATED PRODUCTS (NEW) ========== */}
      <section
        ref={productsRef}
        className={`rv-products ${productsShown ? 'is-shown' : ''}`}
      >
        <div className="rv-container">
          <span className="rv-eyebrow">Highest rated</span>
          <h2 className="rv-h2">Products customers love most</h2>
          <div className="rv-products__grid">
            {TOP_PRODUCTS.map((p, i) => (
              <article className="rv-product" key={p.name}>
                <span className="rv-product__rank">#{i + 1}</span>
                <div className="rv-product__icon">
                  <p.icon size={22} />
                </div>
                <div className="rv-product__body">
                  <h3 className="rv-product__name">{p.name}</h3>
                  <span className="rv-product__cat">{p.category}</span>
                </div>
                <div className="rv-product__stats">
                  <div className="rv-product__rating">
                    <FaStar className="rv-star rv-star--filled" />
                    <span>{p.rating}</span>
                  </div>
                  <span className="rv-product__count">{p.reviewCount} reviews</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="rv-cta">
        <div className="rv-cta__glow" aria-hidden="true" />
        <div className="rv-container rv-cta__inner">
          <h2 className="rv-cta__title">Tried one of our products?</h2>
          <p className="rv-cta__lede">
            Your experience could help another family make the right choice.
          </p>
          <button type="button" className="rv-cta__btn">
            Share your review <FiArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
};

export default Reviews;