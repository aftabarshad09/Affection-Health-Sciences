import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './layout'
import Home from './pages/Home'
import Products from './pages/Products'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Aboutpage from './pages/Aboutpage';

import './App.css'
import ProductsPage from './pages/ProductsPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<Aboutpage />} />

        </Routes>
      </Layout>
      {/* <Layout>
        <Hero />
      </Layout> */}

    </Router>
  )
}

export default App
