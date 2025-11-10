// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import ProductDisplay from './Components/ProductDisplay/ProductDisplay'; // ✅ Import correto
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import ShopContextProvider from './Context/ShopContext';
import MyAccount from './Pages/MyAccount/MyAccount';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kid_banner from './Components/Assets/banner_kids.png';

function App() {
  return (
    <ShopContextProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Shop />} />
            <Route path="/mens/:subcategory?" element={<ShopCategory banner={men_banner} category="mens" />} />
            <Route path="/womens/:subcategory?" element={<ShopCategory banner={women_banner} category="womens" />} />
            <Route path="/kids/:subcategory?" element={<ShopCategory banner={kid_banner} category="kids" />} />
            {/* ✅ Rota correta para ProductDisplay */}
            <Route path="/product/:id" element={<ProductDisplay />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/register" element={<LoginSignup />} />
            <Route path="/minha-conta" element={<MyAccount />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ShopContextProvider>
  );
}

export default App;