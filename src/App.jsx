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
import AdminApp from './admin/AdminApp'
import { CustomerAuthProvider } from './modules/auth/CustomerAuthContext'
import LoginPage from './modules/auth/pages/LoginPage'
import RegisterPage from './modules/auth/pages/RegisterPage'
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage'
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage'
import CartAuthBridge from './modules/cart/CartAuthBridge'
import CartPage from './modules/cart/pages/CartPage'
import ToastContainer from './components/ToastContainer'
import RequireCustomerAuth from './modules/auth/RequireCustomerAuth'
import CheckoutPage from './modules/checkout/pages/CheckoutPage'
import OrderListPage from './modules/orders/pages/OrderListPage'
import OrderDetailPage from './modules/orders/pages/OrderDetailPage'
import AccountLayout from './modules/account/AccountLayout'
import AccountDashboard from './modules/account/pages/AccountDashboard'
import AddressesPage from './modules/account/pages/AddressesPage'
import AccountSettingsPage from './modules/account/pages/AccountSettingsPage'

import './App.css'
import ProductsPage from './pages/ProductsPage'
import Reviews from './pages/Reviews'

function PublicSite() {
  return (
    <CustomerAuthProvider>
      <CartAuthBridge />
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<RequireCustomerAuth><CheckoutPage /></RequireCustomerAuth>} />
          <Route path="/orders" element={<RequireCustomerAuth><OrderListPage /></RequireCustomerAuth>} />
          <Route path="/orders/:orderNumber" element={<RequireCustomerAuth><OrderDetailPage /></RequireCustomerAuth>} />
          <Route path="/account" element={<RequireCustomerAuth><AccountLayout><AccountDashboard /></AccountLayout></RequireCustomerAuth>} />
          <Route path="/account/addresses" element={<RequireCustomerAuth><AccountLayout><AddressesPage /></AccountLayout></RequireCustomerAuth>} />
          <Route path="/account/settings" element={<RequireCustomerAuth><AccountLayout><AccountSettingsPage /></AccountLayout></RequireCustomerAuth>} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/review" element={<Reviews />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <CookieConsent />
    </CustomerAuthProvider>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={<PublicSite />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
