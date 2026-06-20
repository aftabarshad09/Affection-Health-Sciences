import { useState } from 'react';
import {
  FaStar,
  FaRegStar,
  FaQuoteLeft,
  FaCheckCircle,
  FaUserCircle
} from 'react-icons/fa';
import { FiThumbsUp, FiArrowRight } from 'react-icons/fi';
import '../style/Reviews.css';

const overallStats = {
  average: 4.8,
  totalReviews: 1248,
  recommendPercent: 97
};

const ratingBreakdown = [
  { stars: 5, percent: 82 },
  { stars: 4, percent: 12 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 }
];

const featuredReview = {
  name: 'Ayesha Raza',
  location: 'Lahore, Pakistan',
  product: 'Gynogid Forte — Prenatal Supplement',
  rating: 5,
  text: "I started Gynogid Forte in my second trimester after my OB recommended a better folate source. No more nausea after meals, and my last bloodwork came back exactly where it needed to be. Genuinely grateful I found this brand."
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
    text: "My father has been managing cirrhosis for two years, and his hepatologist suggested adding a BCAA supplement. Hepatovital mixes easily and he actually tolerates the vanilla flavor well. His energy and appetite have both improved."
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
    text: "After my mother's surgery, she had almost no appetite. ENERGID PLUS became her main source of nutrition for nearly three weeks. The chocolate flavor was the only thing she'd actually finish without complaining. Huge relief for our whole family."
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
    text: "My toddler is a notoriously picky eater and was falling behind on his growth chart. We started mixing a small amount of Mctolip into his yogurt. It took about three weeks before our pediatrician noted real improvement, but it's working. Wish it came in a bigger bottle."
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
    text: "Bought this for my wife after a friend recommended it. She liked that everything — folic acid, DHA, calcium, iron — was in one scoop instead of five different pills. Easier to stay consistent with, which honestly matters more than anything fancy on the label."
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
    text: "Beyond the product itself, I want to mention the support team — I had questions about dosing alongside my mother's other medication and they responded quickly and pointed me back to her doctor appropriately instead of guessing. That kind of caution builds real trust."
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
    text: "The supplement itself is solid — my father uses it as a meal supplement around his COPD treatment and it's helped him maintain his weight. Only complaint is that delivery to Multan took almost ten days. Otherwise, would recommend."
  }
];

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) =>
    i < rating ? (
      <FaStar key={i} className="reviews-star reviews-star--filled" />
    ) : (
      <FaRegStar key={i} className="reviews-star" />
    )
  );
};

const Reviews = () => {
  const [helpfulClicks, setHelpfulClicks] = useState({});

  const markHelpful = (id) => {
    setHelpfulClicks((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="reviews-page">
      {/* Hero */}
      <section className="reviews-hero">
        <div className="reviews-hero__content">
          <span className="reviews-hero__eyebrow">Customer Reviews</span>
          <h1 className="reviews-hero__title">What Our Customers Are Saying</h1>
          <p className="reviews-hero__subtitle">
            Real experiences from real families — on liver support, maternal
            nutrition, pediatric care, and everyday wellness.
          </p>

          <div className="reviews-hero__summary">
            <div className="reviews-hero__score">
              <span className="reviews-hero__score-number">{overallStats.average}</span>
              <div>
                <div className="reviews-hero__stars">{renderStars(5)}</div>
                <span className="reviews-hero__score-count">
                  Based on {overallStats.totalReviews.toLocaleString()} reviews
                </span>
              </div>
            </div>
            <div className="reviews-hero__divider" aria-hidden="true" />
            <div className="reviews-hero__recommend">
              <span className="reviews-hero__recommend-number">
                {overallStats.recommendPercent}%
              </span>
              <span className="reviews-hero__recommend-label">
                of customers recommend us
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Breakdown */}
      <section className="reviews-breakdown">
        <div className="container">
          <div className="reviews-breakdown__grid">
            <div className="reviews-breakdown__bars">
              <h2>Rating Breakdown</h2>
              {ratingBreakdown.map((r) => (
                <div className="reviews-breakdown__row" key={r.stars}>
                  <span className="reviews-breakdown__label">{r.stars} star</span>
                  <div className="reviews-breakdown__track">
                    <div
                      className="reviews-breakdown__fill"
                      style={{ width: `${r.percent}%` }}
                    />
                  </div>
                  <span className="reviews-breakdown__percent">{r.percent}%</span>
                </div>
              ))}
            </div>

            <div className="reviews-breakdown__featured">
              <FaQuoteLeft className="reviews-breakdown__quote-icon" />
              <p className="reviews-breakdown__featured-text">{featuredReview.text}</p>
              <div className="reviews-breakdown__featured-stars">
                {renderStars(featuredReview.rating)}
              </div>
              <div className="reviews-breakdown__featured-author">
                <FaUserCircle size={36} />
                <div>
                  <strong>{featuredReview.name}</strong>
                  <span>{featuredReview.location}</span>
                  <span className="reviews-breakdown__featured-product">
                    {featuredReview.product}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="reviews-list-section light-bg">
        <div className="container">
          <div className="section-header">
            <h2>Reviews From Our Customers</h2>
            <p>{overallStats.totalReviews.toLocaleString()}+ verified experiences and counting</p>
          </div>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-card__head">
                  <div className="review-card__avatar">
                    <FaUserCircle size={40} />
                  </div>
                  <div className="review-card__identity">
                    <div className="review-card__name-row">
                      <strong>{review.name}</strong>
                      {review.verified && (
                        <span className="review-card__verified">
                          <FaCheckCircle size={12} /> Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="review-card__location">{review.location}</span>
                  </div>
                </div>

                <div className="review-card__stars">{renderStars(review.rating)}</div>

                <h3 className="review-card__title">{review.title}</h3>
                <p className="review-card__product">{review.product}</p>
                <p className="review-card__text">{review.text}</p>

                <div className="review-card__footer">
                  <span className="review-card__date">{review.date}</span>
                  <button
                    type="button"
                    className={`review-card__helpful ${helpfulClicks[review.id] ? 'is-active' : ''}`}
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

      {/* CTA */}
      <section className="reviews-cta">
        <div className="container">
          <div className="reviews-cta__content">
            <h2>Tried one of our products?</h2>
            <p>Your experience could help another family make the right choice.</p>
            <button type="button" className="btn btn-primary reviews-cta__btn">
              Share Your Review <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reviews;
