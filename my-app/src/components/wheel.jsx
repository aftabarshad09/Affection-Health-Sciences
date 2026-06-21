// wheel.jsx — Product showcase wheel
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './wheel.css';
import { FaCapsules } from 'react-icons/fa';
import logo from '../assets/logo.png';

/* ============================================================
   PRODUCT IMAGES
   Path: src/assets/Products/ (capital P, matches the real folder)
   Files are named P1.png .. P13.png — only 7 are used here.
   EDIT THE FILENAMES BELOW to point each product at the correct
   P-number once you've matched them up yourself. Nothing else
   in this file needs to change.
   ============================================================ */
const PRODUCT_IMG_BASE = '/src/assets/Products/';
const PRODUCT_IMG = {
  gynogid: `${PRODUCT_IMG_BASE}P1.png`,
  mctolip: `${PRODUCT_IMG_BASE}P2.png`,
  glumin: `${PRODUCT_IMG_BASE}P3.png`,
  energid: `${PRODUCT_IMG_BASE}P5.png`,
  bestProtein: `${PRODUCT_IMG_BASE}P6.png`,
  lactilus: `${PRODUCT_IMG_BASE}P7.png`,
  hepatovital: `${PRODUCT_IMG_BASE}P8.png`,
};

const ROTATE_INTERVAL = 5000;

const products = [
  {
    label: "Gynogid Forte",
    image: PRODUCT_IMG.gynogid,
    tagline: "Prenatal nutrition, for mom's care",
    content: `Built on the 3G System — Go, Grow, Glow — for sustained maternal energy and healthy fetal development. Enriched with fennel and vanilla extracts. Vanilla flavor, 400gm.`,
    productId: 1,
  },
  {
    label: "MCTOLIP Drops",
    image: PRODUCT_IMG.mctolip,
    tagline: "Medium chain triglycerides",
    content: `Supports weight management, improves brain function, and provides a good energy source — formulated for infants and growing children who need fat absorption support.`,
    productId: 2,
  },
  {
    label: "Glumin SR",
    image: PRODUCT_IMG.glumin,
    tagline: "High quality nutrition for diabetics",
    content: `Delivers sustained energy release with good fats, formulated specifically for diabetic nutritional needs. Vanilla flavor, 400gm net.`,
    productId: 3,
  },
  {
    label: "Energid Plus",
    image: PRODUCT_IMG.energid,
    tagline: "Complete and balanced adult nutrition",
    content: `A heart-friendly, easy-mix adult nutrition supplement delivering 235 kcal per 230ml serving. Available in Strawberry and other flavors, 400g.`,
    productId: 5,
  },
  {
    label: "Best Protein",
    image: PRODUCT_IMG.bestProtein,
    tagline: "Rich source of whey protein",
    content: `A sprinkling protein powder that adds high-quality whey protein to any meal, supporting muscle maintenance and daily protein needs. Net 230gm.`,
    productId: 6,
  },
  {
    label: "Lactilus Prob",
    image: PRODUCT_IMG.lactilus,
    tagline: "Lactobacillus Acidophilus & Zinc",
    content: `Supports digestive and immune health with live bacteria that reach the gut alive. 10 directly-consumed sachets per box.`,
    productId: 7,
  },
  {
    label: "Hepatovital",
    image: PRODUCT_IMG.hepatovital,
    tagline: "BCAA-enriched hepatic nutrition",
    content: `Promotes liver function with branched chain amino acid-enriched nutrition, supporting regeneration and the elevated protein needs of liver care. Halal certified, 400gm.`,
    productId: 8,
  },
];

const WheelProducts = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const radius = 220;
  const innerRadius = 100;
  const cx = 250;
  const cy = 250;
  const sliceAngle = (2 * Math.PI) / products.length;
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, ROTATE_INTERVAL);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleSelect = (index) => {
    setActiveIndex(index);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, ROTATE_INTERVAL);
  };

  const polarToCartesian = (angle, r) => {
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const describeArc = (index) => {
    const startAngle = index * sliceAngle - Math.PI / 2;
    const endAngle = (index + 1) * sliceAngle - Math.PI / 2;
    const [x1, y1] = polarToCartesian(startAngle, radius);
    const [x2, y2] = polarToCartesian(endAngle, radius);
    const [x3, y3] = polarToCartesian(endAngle, innerRadius);
    const [x4, y4] = polarToCartesian(startAngle, innerRadius);

    const largeArc = sliceAngle > Math.PI ? 1 : 0;

    return `M ${x1} ${y1}
            A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
            L ${x3} ${y3}
            A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  const getLabelPosition = (index) => {
    const angle = index * sliceAngle + sliceAngle / 2 - Math.PI / 2;
    const r = (radius + innerRadius) / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      transform: `rotate(${angle * 180 / Math.PI + 90}, ${cx + r * Math.cos(angle)}, ${cy + r * Math.sin(angle)})`
    };
  };

  const active = products[activeIndex];

  return (
    <div className="wheel-section-wrapper">
      <h1 className="wheel-heading">Discover Our Product Range</h1>
      <div className="wheel-services-container">
        <div className="wheel-section">
          <svg className="wheel-svg" viewBox="0 0 500 500">
            {products.map((product, index) => {
              const pos = getLabelPosition(index);
              return (
                <g key={product.label} onClick={() => handleSelect(index)} className="slice-group">
                  <path
                    d={describeArc(index)}
                    className={index === activeIndex ? 'slice active' : 'slice'}
                  />
                  <text
                    className="slice-label"
                    x={pos.x}
                    y={pos.y}
                    transform={pos.transform}
                  >
                    {product.label}
                  </text>
                </g>
              );
            })}
            <circle cx={cx} cy={cy} r={innerRadius - 10} fill="#fff" />
            <image
              href={logo}
              x={cx - 40}
              y={cy - 20}
              height="40"
              width="80"
            />
          </svg>
        </div>

        <div className="content-section" key={activeIndex}>
          <div className="product-showcase">
            <img
              src={active.image}
              alt={active.label}
              className="product-image"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>

          <h2 className="label-heading">
            <FaCapsules /> {active.label}
          </h2>
          <p className="product-tagline">{active.tagline}</p>
          <div className="label-underline"></div>
          <p className="product-description">{active.content}</p>
          <button
            className="read-more-button glass-btn"
            onClick={() => navigate(`/products?product=${active.productId}`)}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default WheelProducts;