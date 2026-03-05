import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./pages/Home/Hero";
import About from "./pages/Home/About";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import CartPage from "./pages/Cart/Cart";
import { ProductListingPage, ProductDetailPage } from "./pages/Product";
import Wishlist from "./pages/Wishlist/Wishlist";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { verify } from "./actions/userActions";

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verify());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
<Toaster
  position="top-center"
  toastOptions={{
    duration: 2500,
    style: {
      background: "#fff",
      color: "#000",
      padding: "14px 20px",
      fontSize: "14px",
      borderRadius: "30px",
      fontWeight: "500",
      letterSpacing: "0.3px",
    },
  }}
/>
      <div className="pt-[60px] space-y-24">
        <Routes>

          {/* Home */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <About />
              </>
            }
          />

          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Products */}
          <Route path="/products" element={<ProductListingPage />} />
          <Route path="/products/:productID" element={<ProductDetailPage />} />

          {/* Cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* 404 */}
          <Route path="*" element={<h1>Page Not Found</h1>} />

        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;