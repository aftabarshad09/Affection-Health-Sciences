import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import '../style/ProductsPage.css';
import { FaTimes, FaCheckCircle, FaFlask, FaShieldAlt, FaLeaf, FaAtom } from 'react-icons/fa';

import heroBg from '../assets/videos/002.mp4';

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
      <img src={product.imageA} alt={product.name} className={`prod-card__dual-img${showA ? ' visible' : ''}`} />
      <img src={product.imageB} alt={product.name} className={`prod-card__dual-img${!showA ? ' visible' : ''}`} />
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
        <img src={product.imageA} alt={product.name} className={`prod-panel__dual-img${showA ? ' visible' : ''}`} />
        <img src={product.imageB} alt={product.name} className={`prod-panel__dual-img${!showA ? ' visible' : ''}`} />
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
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('All');

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => { if (data.success) setProducts(data.products); })
      .catch(() => {});
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
    setSearchParams({}, { replace: true });
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeProduct(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const productId = searchParams.get('product');
    if (!productId) return;
    const match = products.find(p => String(p.id) === productId);
    if (!match) return;
    const timer = setTimeout(() => openProduct(match), 0);
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <div className="prod-pg">
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
        {filtered.length === 0 ? (
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
              onClick={() => openProduct(product)}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {product.badge && (
                <span className="prod-card__badge">{product.badge}</span>
              )}
              <div className="prod-card__img-wrap">
                {product.isDualPack ? (
                  <DualPackCardImage product={product} />
                ) : product.image ? (
                  <div className="prod-card__svg-wrap">
                    <img src={product.image} alt={product.name} className="prod-card__img--svg" />
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
                <div className="prod-card__footer">
                  <span className="prod-card__form"><FaLeaf /> {product.form}</span>
                  <span className="prod-card__cta">View →</span>
                </div>
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
                  <img src={active.image} alt={active.name} className="prod-panel__img-svg" />
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