import { useState, useEffect } from 'react';
import { useSearchParams, useParams, useNavigate } from 'react-router-dom';
import '../style/ProductsPage.css';
import { FaTimes, FaCheckCircle, FaFlask, FaShieldAlt, FaLeaf, FaAtom } from 'react-icons/fa';
import AddToCartButton from '../modules/cart/AddToCartButton';
import WishlistButton from '../modules/wishlist/WishlistButton';
import { formatMoney } from '../utils/currency';
import { optimizedImage } from '../utils/image';

import heroBg from '../assets/videos/002.mp4';

const ProductPriceBlock = ({ product }) => {
  if (!product.retailPrice) {
    return <span className="prod-card__price-request">Price on request</span>;
  }
  const hasDiscount = product.salePrice && product.salePrice < product.retailPrice;
  const discountPct = hasDiscount
    ? Math.round(100 - (product.salePrice / product.retailPrice) * 100)
    : 0;
  return (
    <div className="prod-card__price-row">
      <span className="prod-card__price">{formatMoney(hasDiscount ? product.salePrice : product.retailPrice)}</span>
      {hasDiscount && <span className="prod-card__price--was">{formatMoney(product.retailPrice)}</span>}
      {hasDiscount && <span className="prod-card__discount-badge">-{discountPct}%</span>}
    </div>
  );
};

const categoryColors = {
  "Women's Health": '#db2777',
  'Metabolic Support': '#059669',
  'Amino Acids': '#7c3aed',
  'Energy & Performance': '#d97706',
  'Sports Nutrition': '#0284c7',
  'Gut Health': '#16a34a',
  'Liver Health': '#b45309',
  'Bone Health': '#0891b2',
  'Baby Nutrition': '#c026d3',
  'Stress & Sleep': '#6366f1',
  'Immune Support': '#0d9488',
  'Brain Health': '#8b5cf6',
  'Hormonal Health': '#ec4899',
  'Skin & Antioxidant Care': '#e11d48',
};

const DualPackCardImage = ({ product }) => {
  const [showA, setShowA] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setShowA(prev => !prev), 2400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="prod-card__dual-wrap">
      <img src={optimizedImage(product.imageA)} alt={product.name} loading="lazy" decoding="async" className={`prod-card__dual-img${showA ? ' visible' : ''}`} />
      <img src={optimizedImage(product.imageB)} alt={product.name} loading="lazy" decoding="async" className={`prod-card__dual-img${!showA ? ' visible' : ''}`} />
      <div className="prod-card__dual-dots">
        <span className={`prod-card__dual-dot${showA ? ' active' : ''}`} />
        <span className={`prod-card__dual-dot${!showA ? ' active' : ''}`} />
      </div>
    </div>
  );
};

const DualPackPanelImage = ({ product }) => {
  const [showA, setShowA] = useState(true);
  useEffect(() => {
    const interval = setInterval(() => setShowA(prev => !prev), 2400);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="prod-panel__dual-wrap">
      <div className="prod-panel__dual-img-area">
        <img src={optimizedImage(product.imageA, 800)} alt={product.name} decoding="async" className={`prod-panel__dual-img${showA ? ' visible' : ''}`} />
        <img src={optimizedImage(product.imageB, 800)} alt={product.name} decoding="async" className={`prod-panel__dual-img${!showA ? ' visible' : ''}`} />
      </div>
      <div className="prod-panel__dual-toggle">
        <button className={`dual-dot-btn${showA ? ' active' : ''}`} onClick={() => setShowA(true)} aria-label="Show variant 1" />
        <button className={`dual-dot-btn${!showA ? ' active' : ''}`} onClick={() => setShowA(false)} aria-label="Show variant 2" />
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('All');

  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => { if (data.success) setProducts(data.products); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = products.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.cardLine && p.cardLine.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const openProduct = (product) => {
    setActive(product);
    setTimeout(() => setVisible(true), 10);
    document.body.style.overflow = 'hidden';
  };

  const closeProduct = () => {
    setVisible(false);
    setTimeout(() => {
      setActive(null);
      document.body.style.overflow = '';
    }, 320);
    // Return to the clean /products URL.
    if (slug) navigate('/products', { replace: false });
    else setSearchParams({}, { replace: true });
  };

  // Clicking a product goes to its own URL (/products/<slug>) so the address
  // bar reflects the product and the page is shareable/indexable.
  const goToProduct = (product) => {
    if (product.slug) navigate(`/products/${product.slug}`);
    else openProduct(product);
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeProduct(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Open the matching product's details when the URL carries a slug
  // (/products/<slug>) — this handles both clicks and direct links from Google.
  // The legacy /products?product=<id> deep link is also supported.
  useEffect(() => {
    if (!products.length) return;
    let match = null;
    if (slug) match = products.find((p) => p.slug === slug);
    else {
      const productId = searchParams.get('product');
      if (productId) match = products.find((p) => String(p.id) === productId);
    }
    if (match) {
      const timer = setTimeout(() => openProduct(match), 0);
      return () => clearTimeout(timer);
    }
    // URL has no (valid) product → make sure no modal is open.
    if (!slug && !searchParams.get('product') && active) {
      setVisible(false);
      setActive(null);
      document.body.style.overflow = '';
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, searchParams, products]);

  // Update the browser tab title to the open product (React 19 hoists <title>
  // to <head> and keeps a single one). The full SEO meta/canonical/structured
  // data for crawlers is baked into each prerendered /products/<slug> page.
  return (
    <div className="prod-pg">
      {active && <title>{`${active.name} | Affection Health Sciences`}</title>}
      <section className="prod-hero">
        <video
          className="prod-hero__video"
          autoPlay
          muted
          loop
          playsInline
          src={heroBg}
        />
        <div className="prod-hero__overlay" />
        <div className="prod-hero__content">
          <span className="prod-eyebrow">OUR RANGE</span>
          <h1 className="prod-hero__heading">
            Every Formula. <br /><em>Every Life Stage.</em>
          </h1>
          <p className="prod-hero__sub">
            {products.length > 0 ? `${products.length} clinically designed formulations` : 'Clinically designed formulations'} — each developed to fill a real nutritional gap, not a market trend.
          </p>
        </div>
      </section>

      <div className="prod-filters">
        <div className="prod-filters__inner">
          <div className="prod-search-wrap">
            <svg className="prod-search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3a6 6 0 100 12A6 6 0 009 3zM1 9a8 8 0 1114.32 4.906l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387A8 8 0 011 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              className="prod-search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="prod-search-clear" onClick={() => setSearch('')} aria-label="Clear search">✕</button>
            )}
          </div>
          <div className="prod-filters__chips">
            {categories.map(cat => (
              <button
                key={cat}
                className={`prod-filter-btn glass-btn${filter === cat ? ' active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="prod-grid-wrap">
        {loading ? (
          <div className="prod-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="prod-card prod-card--skeleton" key={i}>
                <div className="prod-card__img-wrap"><div className="skeleton skeleton--img" /></div>
                <div className="prod-card__body">
                  <div className="skeleton skeleton--line skeleton--sm" />
                  <div className="skeleton skeleton--line" />
                  <div className="skeleton skeleton--line skeleton--md" />
                  <div className="skeleton skeleton--btn" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="prod-empty">
            <span className="prod-empty__icon">🔍</span>
            <p className="prod-empty__text">No products match "<strong>{search}</strong>"</p>
            <button className="prod-empty__reset" onClick={() => { setSearch(''); setFilter('All'); }}>Clear search</button>
          </div>
        ) : (
        <div className="prod-grid">
          {filtered.map((product, i) => (
            <div
              className={`prod-card${product.cardVariant ? ` prod-card--${product.cardVariant}` : ''}`}
              key={product.id}
              onClick={() => goToProduct(product)}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {product.badge && (
                <span className="prod-card__badge">{product.badge}</span>
              )}
              <WishlistButton product={product} className="prod-card__wishlist" />
              <div className="prod-card__img-wrap">
                {product.isDualPack ? (
                  <DualPackCardImage product={product} />
                ) : product.image ? (
                  <div className="prod-card__svg-wrap">
                    <img src={optimizedImage(product.image)} alt={product.name} loading="lazy" decoding="async" className="prod-card__img--svg" />
                  </div>
                ) : null}
              </div>
              <div className="prod-card__body">
                <span
                  className="prod-card__cat"
                  style={{ color: categoryColors[product.category] || '#7c3aed' }}
                >
                  {product.category}
                </span>
                <h3 className="prod-card__name">{product.name}</h3>
                <p className="prod-card__one-line">{product.cardLine}</p>
                <ProductPriceBlock product={product} />
                <div className="prod-card__footer">
                  <span className="prod-card__form"><FaLeaf /> {product.form}</span>
                  <span className="prod-card__cta">View →</span>
                </div>
                <AddToCartButton product={product} className="prod-card__add-btn glass-btn" />
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {active && (
        <div className={`prod-modal-backdrop${visible ? ' open' : ''}`} onClick={closeProduct}>
          <div className={`prod-modal${visible ? ' open' : ''}`} onClick={e => e.stopPropagation()}>

            <div className="prod-modal__left">
              {active.isDualPack ? (
                <DualPackPanelImage product={active} />
              ) : active.image ? (
                <div className="prod-panel__svg-wrap">
                  <img src={optimizedImage(active.image, 800)} alt={active.name} decoding="async" className="prod-panel__img-svg" />
                </div>
              ) : null}
              <div className="prod-panel__left-text">
                <span className="prod-panel__cat">{active.category}</span>
                <h2 className="prod-panel__name">{active.name}</h2>
                <p className="prod-panel__tagline">{active.tagline}</p>
              </div>
            </div>

            <div className="prod-modal__right">
              <button className="prod-panel__close" onClick={closeProduct} aria-label="Close">
                <FaTimes />
              </button>
              <div className="prod-panel__scroll">
                {active.badge && <span className="prod-panel__badge">{active.badge}</span>}
                <ProductPriceBlock product={active} />
                <div className="prod-panel__actions">
                  <AddToCartButton product={active} className="prod-panel__add-btn glass-btn" />
                  <WishlistButton product={active} className="prod-panel__wishlist" />
                </div>
                <p className="prod-panel__desc">{active.description}</p>

                <div className="prod-panel__section">
                  <h4 className="prod-panel__section-title"><FaCheckCircle /> Key Benefits</h4>
                  <ul className="prod-panel__benefits">
                    {active.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>

                {active.ingredients && active.ingredients.length > 0 && (
                  <div className="prod-panel__section">
                    <h4 className="prod-panel__section-title"><FaAtom /> Ingredients / Formulation</h4>
                    <table className="prod-panel__ing-table">
                      <thead>
                        <tr>
                          <th>Ingredient</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {active.ingredients.map((ing, i) => (
                          <tr key={i}>
                            <td>{ing.name}</td>
                            <td>{ing.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="prod-panel__meta-row">
                  <div className="prod-panel__meta-item">
                    <span className="prod-panel__meta-label"><FaFlask /> Dosage</span>
                    <span className="prod-panel__meta-val">{active.dosage}</span>
                  </div>
                  <div className="prod-panel__meta-item">
                    <span className="prod-panel__meta-label"><FaShieldAlt /> Format</span>
                    <span className="prod-panel__meta-val">{active.form}</span>
                  </div>
                </div>
                <div className="prod-panel__trust">
                  <span>✓ GMP Certified</span>
                  <span>✓ Third-Party Tested</span>
                  <span>✓ No Artificial Fillers</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ProductsPage;