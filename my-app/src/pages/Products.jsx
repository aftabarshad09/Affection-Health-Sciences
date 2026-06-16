import React, { useState } from 'react';
import { FaSun, FaVial, FaHeart, FaFish, FaLeaf, FaCheckCircle, FaFlask, FaGlobeAmericas } from 'react-icons/fa';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import '../style/Products.css';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    // Vitamins
    {
      id: 1,
      name: 'Vitamin D3 1000IU',
      category: 'vitamins',
      description: 'Supports bone health and immune system',
      price: '$18.99',
      benefits: ['Bone Health', 'Immune Support', 'Calcium Absorption'],
      Icon: FaSun
    },
    {
      id: 2,
      name: 'Vitamin C 500mg',
      category: 'vitamins',
      description: 'Antioxidant support and immune boost',
      price: '$16.99',
      benefits: ['Immunity', 'Skin Health', 'Antioxidant'],
      Icon: FaOrange
    },
    {
      id: 3,
      name: 'Vitamin B Complex',
      category: 'vitamins',
      description: 'Energy and metabolism support',
      price: '$22.99',
      benefits: ['Energy', 'Metabolism', 'Nerve Function'],
      Icon: FaBolt
    },
    // Minerals
    {
      id: 4,
      name: 'Full Zinc Magnesium',
      category: 'minerals',
      description: 'Premium zinc and magnesium blend for optimal health',
      price: '$24.99',
      benefits: ['Muscle Recovery', 'Sleep Quality', 'Immunity'],
      Icon: FaVial
    },
    {
      id: 5,
      name: 'Calcium Plus',
      category: 'minerals',
      description: 'Strong bones and teeth support',
      price: '$20.99',
      benefits: ['Bone Strength', 'Dental Health', 'Muscle Function'],
      Icon: FaBone
    },
    {
      id: 6,
      name: 'Iron Supplement',
      category: 'minerals',
      description: 'Combat fatigue and boost energy',
      price: '$19.99',
      benefits: ['Energy', 'Oxygen Transport', 'Anemia Support'],
      Icon: FaHeart
    },
    // Supplements
    {
      id: 7,
      name: 'Omega-3 Fish Oil',
      category: 'supplements',
      description: 'Heart and brain health supplement',
      price: '$32.99',
      benefits: ['Heart Health', 'Brain Function', 'Joint Support'],
      Icon: FaFish
    },
    {
      id: 8,
      name: 'Multivitamin Complex',
      category: 'supplements',
      description: 'Complete daily nutritional support',
      price: '$28.99',
      benefits: ['Overall Health', 'Daily Nutrition', 'Energy'],
      Icon: FaLeaf
    },
    {
      id: 9,
      name: 'Probiotics',
      category: 'supplements',
      description: 'Digestive and gut health support',
      price: '$29.99',
      benefits: ['Gut Health', 'Digestion', 'Immunity'],
      Icon: FaMicrobe
    },
    {
      id: 10,
      name: 'Collagen Peptides',
      category: 'supplements',
      description: 'Skin, joint and bone support',
      price: '$35.99',
      benefits: ['Skin Elasticity', 'Joint Health', 'Bone Strength'],
      Icon: FaSparkles
    },
    {
      id: 11,
      name: 'Glucosamine Chondroitin',
      category: 'supplements',
      description: 'Joint mobility and flexibility',
      price: '$31.99',
      benefits: ['Joint Mobility', 'Flexibility', 'Cartilage Support'],
      Icon: FaRunning
    },
    {
      id: 12,
      name: 'Turmeric Curcumin',
      category: 'supplements',
      description: 'Anti-inflammatory and antioxidant support',
      price: '$26.99',
      benefits: ['Anti-inflammatory', 'Antioxidant', 'Joint Support'],
      Icon: FaLeafOpen
    }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'vitamins', label: 'Vitamins' },
    { id: 'minerals', label: 'Minerals' },
    { id: 'supplements', label: 'Supplements' }
  ];

  return (
    <div className="products-page">
      <Hero 
        title="Our Products" 
        subtitle="Premium nutrition supplements for every health goal"
        Icon={FaBox}
      />

      {/* Product Categories */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Explore Our Collections</h2>
            <p>Find the right supplement for your wellness journey</p>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-4">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-wrapper">
                <ProductCard product={product} />
                <div className="product-benefits">
                  <p className="benefits-label">Key Benefits:</p>
                  <ul className="benefits-list">
                    {product.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Details */}
      <section className="category-details light-bg">
        <div className="container">
          <h2 className="section-title">Product Categories</h2>
          <div className="grid grid-3">
            <div className="category-detail-card">
              <div className="category-icon"><FaSun size={40} /></div>
              <h3>Vitamins</h3>
              <p>Essential micronutrients to support your daily health needs and boost immunity.</p>
              <a href="#" className="learn-more">Learn More →</a>
            </div>
            <div className="category-detail-card">
              <div className="category-icon"><FaVial size={40} /></div>
              <h3>Minerals</h3>
              <p>Critical minerals for strong bones, muscle function, and metabolic health.</p>
              <a href="#" className="learn-more">Learn More →</a>
            </div>
            <div className="category-detail-card">
              <div className="category-icon"><FaLeaf size={40} /></div>
              <h3>Supplements</h3>
              <p>Advanced formulations for specialized health goals and optimal wellness.</p>
              <a href="#" className="learn-more">Learn More →</a>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="quality-assurance">
        <div className="container">
          <h2 className="section-title">Quality & Safety</h2>
          <div className="grid grid-3">
            <div className="qa-card">
              <div className="qa-icon"><FaCheckCircle size={40} /></div>
              <h3>FDA Approved</h3>
              <p>All products are manufactured in FDA-approved facilities with strict compliance.</p>
            </div>
            <div className="qa-card">
              <div className="qa-icon"><FaFlask size={40} /></div>
              <h3>Lab Tested</h3>
              <p>Every batch is third-party tested for purity, potency, and safety.</p>
            </div>
            <div className="qa-card">
              <div className="qa-icon"><FaGlobeAmericas size={40} /></div>
              <h3>Natural Ingredients</h3>
              <p>We source premium, natural ingredients from trusted suppliers worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="products-cta light-bg">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Your Wellness Journey?</h2>
            <p>Get expert guidance on choosing the right supplements for your needs.</p>
            <button className="btn btn-primary">Contact Our Experts</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Products;
