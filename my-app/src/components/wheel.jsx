// wheel.jsx — Product showcase wheel
import { useState, useEffect, useRef } from 'react';
import './wheel.css';
import { FaCapsules } from 'react-icons/fa';
import logo from '../assets/logo.png';
import image1 from '../assets/image1.png'

const ROTATE_INTERVAL = 5000;


const products = [
  {
    label: "Hepatovital",
    image: image1,
    tagline: "Targeted hepatic care",
    content: `Provides optimized BCAAs (Branched Chain Amino Acids) enriched nutrition, specifically to support liver health and liver disease management.

Stimulates growth factors and favors the natural regeneration process, supported by a high leucine quantity — meeting the higher protein and hypermetabolic needs of cirrhosis patients.

5-scoop serving: 217 kcal total | 45 kcal/scoop | 1.5g protein/scoop. Available in Vanilla and Strawberry, 400gm.`,
  },
  {
    label: "MCTOLIP",
    image: image1,
    tagline: "Medium chain triglycerides, cholesterol free",
    content: `A fat-rich nutritional supplement containing saturated and monounsaturated fatty acids, recommended for low weight babies and fat malabsorption support.

Helps with weight management in children, supports physiological development in newborn infants, and enhances absorption of amino acids, calcium, and magnesium.

Useful for toddler weight gain, sustained energy, and improved intestinal absorption of fat and calcium.`,
  },
  {
    label: "Gynogid Forte",
    image: image1,
    tagline: "Premium maternal nutrition",
    content: `Built on a 3G nutritional system — Go, Grow, Glow — providing sustained energy, supporting fetal development, and promoting dynamic maternal health.

Fortified with DHA (18.6mg), Folic Acid (384mg), Calcium (355mg), and Iron (12mg) per serving.

213 kcal and 10g protein per serving, 5 scoops daily. Vanilla flavor, 400gm net.`,
  },
  {
    label: "Energid Plus",
    image: image1,
    tagline: "Complete and balanced adult nutrition",
    content: `A high-quality nutritional supplement for adults that mixes easily with water and provides complete nutrition, or can be used as a meal replacement.

46 kcal per scoop, 1.6g protein/kg body weight, 230 kcal per 230ml serving.

Available in Vanilla, Strawberry, Mango, and Chocolate, 400gm.`,
  },
  {
    label: "Mctolip Baby",
    image: image1,
    tagline: "The perfect baby supplement",
    content: `Supports weight management, improves brain function, and provides a good energy source for infants. Cholesterol free.

Recommended for low weight babies and fat malabsorption, helping enhance absorption of amino acids, calcium, and magnesium during early development.

Also suitable for gentle skin massage in children.`,
  },
  {
    label: "NutriPro",
    image: image1,
    tagline: "Advanced nutritional supplement",
    content: `A premium quality nutritional supplement designed for individuals requiring high-calorie and high-protein dietary support.

Complete and balanced nutrition that's easy to mix and digest, suitable for all age groups, and supports muscle maintenance and recovery.

220 kcal and 12g protein per serving, with essential vitamins, minerals, and Omega-3/Omega-6 fatty acids. Vanilla, Strawberry, and Chocolate, 500gm.`,
  },
  {
    label: "ImmunoBoost",
    image: image1,
    tagline: "Immune support, formulated with practitioners",
    content: `Specially formulated to support and strengthen the immune system with essential nutrients and antioxidants.

Includes Vitamin C (100mg), Vitamin D3 (2000 IU), Zinc (15mg), Selenium (55mcg), Elderberry Extract, and Echinacea.

Strengthens immune response, reduces oxidative stress, and supports respiratory health. Natural Berry flavor, 300gm.`,
  },
];

const WheelProducts = () => {
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

        <div className="content-section">
          <div className="product-header">
            <img src={active.image} alt={active.label} className="product-image" />
            <h2 className="label-heading">
              <FaCapsules /> {active.label}
            </h2>
          </div>
          <div className="label-underline"></div>
          <p className="product-description">{active.content}</p>
          <button className="read-more-button">Read More</button>
        </div>
      </div>
    </div>
  );
};

export default WheelProducts;
