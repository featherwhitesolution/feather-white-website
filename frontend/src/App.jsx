import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Policies from './pages/Policies';
import ResetPassword from './pages/ResetPassword';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-navy-900 font-sans text-cream-100">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/policies/*" element={<Policies />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          {/* Add more routes as needed */}
          <Route path="*" element={<div className="p-20 text-center">404 - Page Not Found</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
