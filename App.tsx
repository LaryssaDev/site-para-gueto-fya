import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Admin from './pages/Admin';
import ProductDetails from './pages/ProductDetails';
import Catalogo from './pages/Catalogo';
import Checkout from './pages/Checkout';
import WhatsAppFloat from './components/WhatsAppFloat';

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="cart" element={<Cart />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="catalogo" element={<Catalogo />} />
            <Route path="checkout" element={<Checkout />} />
          </Route>
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <WhatsAppFloat />
      </Router>
    </StoreProvider>
  );
};

export default App;