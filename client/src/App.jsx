
import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Hero from "./pages/Home/Hero";
import About from "./pages/Home/About";
import { Register } from "./pages/Auth/Register";
import { Login } from "./pages/Auth/Login";
import LoginModal from "./pages/Auth/LoginModal";
import CartPage from "./pages/Cart/Cart";
import {
  ProductListingPage,
  ProductDetailPage,
} from "./pages/Product";
import Wishlist from "./pages/Wishlist/Wishlist";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { verify } from "./actions/userActions";
import { getWishlist } from "./actions/wishlistActions";
import { getCart } from "./actions/cartActions";

import Profile from "./pages/Profile/Profile";
import Checkout from "./pages/Checkout/Checkout";
import Payment from "./pages/Checkout/Payment";

import Footer from "./components/Footer/Footer";
import CategorySpotlight from "./pages/Home/CategorySpotlight";
import ScrollToTop from "./components/ScrollToTop";

import AdminRoute from "./components/Global/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProductsPage from "./pages/Product/AdminProductsPage";
import AdminProductFormPage from "./pages/Product/AdminProductFormPage";

import { setShowLoginModalFalse } from "./slices/userSlice";

const App = () => {
  const dispatch = useDispatch();
  const { showLoginModal } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(verify());
    dispatch(getWishlist());
    dispatch(getCart());
  }, [dispatch]);

  return (
    <>
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => dispatch(setShowLoginModalFalse())}
      />

      <Toaster
        position="bottom-center"
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

      <div className="min-h-screen pt-[60px] flex-1"> 
        <Routes>
          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductsPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/create"
            element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/products/edit/:productID"
            element={
              <AdminRoute>
                <AdminProductFormPage />
              </AdminRoute>
            }
          />

          {/* Home */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <CategorySpotlight />
              </>
            }
          />

          {/* User */}
          <Route path="/profile" element={<Profile />} />

          {/* Auth */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Products */}
          <Route path="/products" element={<ProductListingPage />} />
          <Route
            path="/products/:productID"
            element={<ProductDetailPage />}
          />

          {/* Cart */}
          <Route path="/cart" element={<CartPage />} />

          {/* Wishlist */}
          <Route path="/wishlist" element={<Wishlist />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/payment" element={<Payment />} />

          {/* 404 */}
          <Route path="*" element={<h1>Page Not Found</h1>} />
        </Routes>
      </div>

      <About />
      <Footer />
      </div>
    </>
  );
};

export default function AppWrapper() {
  return (
    <Router>
      <ScrollToTop />
      <App />
    </Router>
  );
}

