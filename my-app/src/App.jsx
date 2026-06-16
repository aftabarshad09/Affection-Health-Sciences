import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import Home from './pages/Home'
import About from './pages/About'
import Products from './pages/Products'
import Blogs from './pages/Blogs'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import './App.css'
import Hero from './components/Hero'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
      {/* <Layout>
        <Hero />
      </Layout> */}

    </Router>
  )
}

export default App
