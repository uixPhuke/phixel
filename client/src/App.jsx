import React from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./pages/Home/Hero";
import About from "./pages/Home/About";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import { Profile } from "./pages/Profile/Profile";
import { ProductListingPage, ProductDetailPage } from '../pages/product';
import { ProductCard, ProductFilters } from '../components/product';
import { useProducts } from '../hooks/useProducts';

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
     
      <div className="pt-[60px] space-y-24">
        {/* Main Routes */}
        <Routes>
          <Route path="/" element={<>
                <Hero />
                <About />
              </>} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
