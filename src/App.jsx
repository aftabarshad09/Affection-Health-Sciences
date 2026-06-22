import { Routes, Route } from 'react-router-dom'
import Layout from './layout'
import ScrollToTop from './components/ScrollToTop'
import CookieConsent from './components/CookieConsent'
import Home from './pages/Home'
import Blogs from './pages/Blogs'
import BlogPost from './pages/BlogPost'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import Aboutpage from './pages/Aboutpage';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

import './App.css'
import ProductsPage from './pages/ProductsPage'
import Reviews from './pages/Reviews'

function App() {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/review" element={<Reviews />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Layout>
      {/* <Layout>
        <Hero />
      </Layout> */}
      <CookieConsent />
    </>
  )
}

export default App
