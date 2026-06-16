import React from 'react';
import { FaDumbbell, FaVial, FaSun, FaFish, FaLeaf, FaCheckCircle, FaFlask, FaMedal, FaBox, FaTrophy, FaHandshake } from 'react-icons/fa';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import FAQ from '../components/FAQ';
import Newsletter from '../components/Newsletter';
import Testimonials from '../components/Testimonials';
import '../style/Home.css';

const Home = () => {

  return (
    <div className="home-page">
      <Hero />
      <FAQ />
    </div>
  );
};

export default Home;
