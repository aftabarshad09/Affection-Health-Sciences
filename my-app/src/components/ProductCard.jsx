import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.Icon ? <product.Icon size={80} /> : product.image}
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">{product.price}</div>
        <button className="btn btn-primary btn-small">
          <FaShoppingCart style={{ marginRight: '8px' }} /> Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
