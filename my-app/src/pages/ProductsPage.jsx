import React, { useState, useEffect } from 'react';
import '../style/ProductsPage.css';
import { FaTimes, FaCheckCircle, FaFlask, FaShieldAlt, FaLeaf } from 'react-icons/fa';

import P1 from '../assets/Products/P1.png';
import P2 from '../assets/Products/P2.png';
import P3 from '../assets/Products/P3.png';
import P4 from '../assets/Products/P4.png';
import P5 from '../assets/Products/P5.png';
import P6 from '../assets/Products/P6.png';
import P7 from '../assets/Products/P7.png';
import P8 from '../assets/Products/P8.png';

const productImages = {
  gynogid: P1,
  mctLipdrop: P2,
  gluminSr: P3,
  mctLip: P4,
  energid: P5,
  bestProtein: P6,
  lactilus: P7,
  hepatovital: P8,
};

const products = [
  {
    id: 1,
    name: 'Gynogid',
    tagline: "Women's Hormonal & Reproductive Support",
    category: "Women's Health",
    image: productImages.gynogid,
    splash: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80',
    badge: 'Clinician Recommended',
    description: "Gynogid is a clinically formulated supplement designed to support hormonal balance, menstrual regularity, and reproductive wellness in women. Each capsule combines evidence-based botanicals and micronutrients to address the root causes of hormonal imbalance.",
    benefits: ['Supports hormonal balance and regularity','Reduces PMS and cycle discomfort','Promotes reproductive wellness','Clinically tested botanical blend'],
    dosage: '2 capsules daily with meals',
    form: 'Capsules — 60 count',
  },
  {
    id: 2,
    name: 'MCT Lipdrop',
    tagline: 'Medium-Chain Triglyceride Emulsion Drops',
    category: 'Metabolic Support',
    image: productImages.mctLipdrop,
    splash: 'https://images.unsplash.com/photo-1535185384036-28bbc8035f28?w=800&q=80',
    badge: null,
    description: 'MCT Lipdrop delivers pure medium-chain triglycerides in a highly bioavailable emulsion format — ideal for rapid energy delivery, ketogenic support, and cognitive clarity. Tasteless drops that blend effortlessly into any liquid.',
    benefits: ['Rapid, sustained energy without sugar spikes','Supports ketogenic and low-carb lifestyles','Enhances cognitive clarity and focus','Easy-to-absorb emulsion format'],
    dosage: '10–15 drops twice daily in water or food',
    form: 'Oral drops — 30ml',
  },
  {
    id: 3,
    name: 'Glumin SR',
    tagline: 'Extended-Release L-Glutamine Formula',
    category: 'Amino Acids',
    image: productImages.gluminSr,
    splash: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    badge: 'New',
    description: 'Glumin SR is our sustained-release L-Glutamine formulation — delivering consistent amino acid support over a 6-hour window. Designed for gut lining repair, muscle recovery, and immune function.',
    benefits: ['6-hour sustained-release delivery','Repairs and seals gut lining permeability','Supports muscle recovery post-exercise','Immune-modulating amino acid profile'],
    dosage: '1 tablet twice daily — morning and evening',
    form: 'SR Tablets — 30 count',
  },
  {
    id: 4,
    name: 'MCT Lip',
    tagline: 'Pure MCT Oil for Daily Use',
    category: 'Metabolic Support',
    image: productImages.mctLip,
    splash: 'https://images.unsplash.com/photo-1470010762743-1fa2363c65f0?w=800&q=80',
    badge: null,
    description: 'MCT Lip is our premium unflavoured MCT oil, cold-processed from non-GMO coconut. Ideal for daily coffee, smoothies, or cooking at low heat. Provides clean, fast-burning fuel to support metabolic health and mental performance.',
    benefits: ['Cold-pressed from coconut — non-GMO','Odourless and tasteless in food or drink','Supports fat metabolism and weight management','Dual C8 and C10 chain profile'],
    dosage: '1–2 tablespoons daily in food or beverages',
    form: 'Liquid Oil — 250ml',
  },
  {
    id: 5,
    name: 'Energid',
    tagline: 'Vitality & Energy Complex',
    category: 'Energy & Performance',
    image: productImages.energid,
    splash: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    badge: 'Bestseller',
    description: 'Energid is a comprehensive energy and vitality formula combining adaptogenic herbs, B-vitamins, and mitochondrial cofactors. No caffeine jitters — just clean, sustainable energy from the cellular level up.',
    benefits: ['Sustained energy without stimulant crash','Adaptogenic support for stress resilience','Mitochondrial cofactors for cellular energy','B-vitamin complex for metabolic support'],
    dosage: '1 capsule with breakfast daily',
    form: 'Capsules — 30 count',
  },
  {
    id: 6,
    name: 'Best Protein',
    tagline: 'Premium Whey Protein Isolate',
    category: 'Sports Nutrition',
    image: productImages.bestProtein,
    splash: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80',
    badge: null,
    description: 'Best Protein delivers 25g of ultra-filtered whey protein isolate per serving — virtually no lactose, minimal fat, and a complete amino acid profile. Clean flavouring from natural sources with no artificial sweeteners.',
    benefits: ['25g protein isolate per serving','Ultra-filtered — minimal lactose and fat','Complete essential amino acid profile','No artificial colours or sweeteners'],
    dosage: '1 scoop (30g) in 250ml water or milk post-workout',
    form: 'Powder — 900g',
  },
  {
    id: 7,
    name: 'Lactilus',
    tagline: 'Advanced Probiotic & Prebiotic Complex',
    category: 'Gut Health',
    image: productImages.lactilus,
    splash: 'https://images.unsplash.com/photo-1493813842493-0edea0be7ecd?w=800&q=80',
    badge: null,
    description: 'Lactilus combines multi-strain Lactobacillus and Bifidobacterium cultures with a prebiotic FOS base. Enteric-coated capsules ensure live cultures survive stomach acid and reach the intestine intact.',
    benefits: ['10-strain probiotic — 20 billion CFU','Prebiotic FOS base nourishes healthy flora','Enteric-coated for guaranteed gut delivery','Supports digestion, immunity and mood'],
    dosage: '1 capsule daily on an empty stomach',
    form: 'Capsules — 30 count',
  },
  {
    id: 8,
    name: 'Hepatovital',
    tagline: 'Advanced Hepatic Support',
    category: 'Liver Health',
    image: productImages.hepatovital,
    splash: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
    badge: 'Popular',
    description: 'Clinically formulated to support liver function, detoxification pathways, and hepatic cell regeneration. Each capsule delivers a precise blend of silymarin, phosphatidylcholine, and N-acetyl cysteine.',
    benefits: ['Promotes liver cell regeneration','Supports natural detox pathways','Reduces hepatic oxidative stress','Improves bile production'],
    dosage: '2 capsules daily with meals',
    form: 'Capsules — 60 count',
  },
  {
    id: 9,
    name: 'OsteoShield',
    tagline: 'Bone & Joint Complex',
    category: 'Bone Health',
    image: null,
    splash: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    badge: null,
    description: 'A comprehensive bone and joint formula combining calcium carbonate, vitamin D3, K2-MK7, and collagen peptides. Engineered to maximise calcium deposition in bones, not arteries.',
    benefits: ['Maximises calcium absorption','Supports joint flexibility','Reduces fracture risk','Protects cartilage tissue'],
    dosage: '2 tablets daily with food',
    form: 'Tablets — 60 count',
  },
  {
    id: 10,
    name: 'VitaD3+K2',
    tagline: 'The Sunshine Duo',
    category: 'Vitamins',
    image: null,
    splash: 'https://images.unsplash.com/photo-1470010762743-1fa2363c65f0?w=800&q=80',
    badge: null,
    description: 'High-potency D3 (5000 IU) paired with K2-MK7 for safe calcium direction. Essential for immune regulation, mood stability, and musculoskeletal health.',
    benefits: ['Optimises vitamin D levels fast','Directs calcium to bones safely','Regulates immune response','Supports mood and focus'],
    dosage: '1 softgel daily with a fat-containing meal',
    form: 'Softgels — 60 count',
  },
  {
    id: 11,
    name: 'OmegaPure',
    tagline: 'Ultra-Refined Fish Oil',
    category: 'Omega Fatty Acids',
    image: null,
    splash: 'https://images.unsplash.com/photo-1535185384036-28bbc8035f28?w=800&q=80',
    badge: null,
    description: 'Molecularly distilled omega-3 concentrate providing 1000mg EPA+DHA per softgel. Third-party tested for heavy metals, PCBs, and oxidation markers.',
    benefits: ['Anti-inflammatory action','Supports cardiovascular health','Improves brain function','Zero fishy aftertaste'],
    dosage: '2 softgels daily with meals',
    form: 'Softgels — 90 count',
  },
  {
    id: 12,
    name: 'CalciMom',
    tagline: 'Prenatal Calcium Formula',
    category: "Women's Health",
    image: null,
    splash: 'https://images.unsplash.com/photo-1515023115689-589c33041d3c?w=800&q=80',
    badge: 'Prenatal',
    description: 'Calcium citrate-based prenatal formula with magnesium, D3, K2, and folic acid. Citrate form works without stomach acid — ideal during pregnancy when acid levels fluctuate.',
    benefits: ['Safe during all trimesters','Supports foetal bone formation','Reduces preeclampsia risk','No stomach acid required'],
    dosage: '2 tablets twice daily with food',
    form: 'Tablets — 120 count',
  },
  {
    id: 13,
    name: 'MultiVita Kids',
    tagline: "Complete Children's Multivitamin",
    category: 'Baby Nutrition',
    image: null,
    splash: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&q=80',
    badge: null,
    description: 'A complete A-Z multivitamin formulated for children aged 3–12. Covers nutritional gaps in picky eaters with natural fruit flavours and zero artificial colours or sweeteners.',
    benefits: ['Covers 18 essential nutrients','Natural fruit flavours','Zero artificial additives','Supports growth and immunity'],
    dosage: '2 gummies daily',
    form: 'Gummies — 60 count',
  },
  {
    id: 14,
    name: 'HepatoDetox',
    tagline: 'Liver Cleanse & Renewal',
    category: 'Liver Health',
    image: null,
    splash: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80',
    badge: null,
    description: 'A 30-day hepatic renewal protocol using artichoke extract, dandelion root, alpha lipoic acid, and turmeric. Designed to reduce hepatic load and support phase I and II detoxification.',
    benefits: ['Supports phase I & II liver detox','Reduces liver inflammation','Improves bile flow','Antioxidant liver protection'],
    dosage: '1 capsule three times daily before meals',
    form: 'Capsules — 90 count',
  },
];

const categoryColors = {
  "Women's Health": '#db2777',
  'Metabolic Support': '#059669',
  'Amino Acids': '#7c3aed',
  'Energy & Performance': '#d97706',
  'Sports Nutrition': '#0284c7',
  'Gut Health': '#16a34a',
  'Liver Health': '#b45309',
  'Bone Health': '#0891b2',
  'Vitamins': '#dc2626',
  'Omega Fatty Acids': '#0369a1',
  'Baby Nutrition': '#c026d3',
};

const ProductsPage = () => {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const [filter, setFilter] = useState('All');

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
  const filtered = filter === 'All' ? products : products.filter(p => p.category === filter);

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
    }, 420);
  };

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') closeProduct(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div className="prod-pg">

      <section className="prod-hero">
        <span className="prod-eyebrow">OUR RANGE</span>
        <h1 className="prod-hero__heading">
          Every Formula. <br /><em>Every Life Stage.</em>
        </h1>
        <p className="prod-hero__sub">
          14 clinically designed formulations — each developed to fill a real nutritional gap, not a market trend.
        </p>
      </section>

      <div className="prod-filters">
        <div className="prod-filters__inner">
          {categories.map(cat => (
            <button
              key={cat}
              className={`prod-filter-btn${filter === cat ? ' active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="prod-grid-wrap">
        <div className="prod-grid">
          {filtered.map((product, i) => (
            <div
              className="prod-card"
              key={product.id}
              onClick={() => openProduct(product)}
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {product.badge && (
                <span className="prod-card__badge">{product.badge}</span>
              )}
              <div className="prod-card__img-wrap">
                {product.image ? (
                  <div className="prod-card__svg-wrap">
                    <img src={product.image} alt={product.name} className="prod-card__img--svg" />
                  </div>
                ) : (
                  <>
                    <img src={product.splash} alt={product.name} className="prod-card__img" />
                    <div className="prod-card__img-overlay" />
                  </>
                )}
              </div>
              <div className="prod-card__body">
                <span className="prod-card__cat" style={{ color: categoryColors[product.category] || '#7c3aed' }}>
                  {product.category}
                </span>
                <h3 className="prod-card__name">{product.name}</h3>
                <p className="prod-card__tagline">{product.tagline}</p>
                <div className="prod-card__footer">
                  <span className="prod-card__form"><FaLeaf /> {product.form}</span>
                  <span className="prod-card__cta">View →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {active && (
        <div className={`prod-panel-backdrop${visible ? ' open' : ''}`} onClick={closeProduct}>
          <div className={`prod-panel${visible ? ' open' : ''}`} onClick={e => e.stopPropagation()}>

            <div className="prod-panel__left">
              {active.image ? (
                <div className="prod-panel__svg-wrap">
                  <img src={active.image} alt={active.name} className="prod-panel__img-svg" />
                </div>
              ) : (
                <>
                  <img src={active.splash} alt={active.name} className="prod-panel__img" />
                  <div className="prod-panel__img-tint" />
                </>
              )}
              <div className="prod-panel__left-text">
                <span className="prod-panel__cat">{active.category}</span>
                <h2 className="prod-panel__name">{active.name}</h2>
                <p className="prod-panel__tagline">{active.tagline}</p>
              </div>
            </div>

            <div className="prod-panel__right">
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