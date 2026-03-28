import React, { useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Hero from "./pages/Home/Hero";
import About from "./pages/Home/About";
import { Register } from "./pages/Auth/Register";
import { getWishlist } from "./actions/wishlistActions";
import { Login } from "./pages/Auth/Login";
import CartPage from "./pages/Cart/Cart";
import { ProductListingPage, ProductDetailPage } from "./pages/Product";
import Wishlist from "./pages/Wishlist/Wishlist";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { verify } from "./actions/userActions";
import { getCart } from "./actions/cartActions";  
import Profile from "./pages/Profile/Profile";
import Checkout from "./pages/Checkout/Checkout";
import Payment from "./pages/Checkout/Payment";
import Footer from "./components/Footer/Footer";
import CategorySpotlight from "./pages/Home/CategorySpotlight";
import { setShowLoginModalFalse } from "./slices/userSlice";
import { useSelector } from "react-redux";
import LoginModal from "./pages/Auth/LoginModal";

import AdminRoute from "./components/Global/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const App = () => {

  const dispatch = useDispatch();
   const { showLoginModal } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(verify());
    dispatch(getWishlist());
       dispatch(getCart());
    
  }, [dispatch]);

  return (
    <BrowserRouter>
    
      <Navbar />
<LoginModal
        isOpen={showLoginModal}
        onClose={() => dispatch(setShowLoginModalFalse())}
      />

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

          {/* Admin Dashboard */}
          <Route
  path="/admin/dashboard"
  element={
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  }
/>

          {/* Home */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <CategorySpotlight/>
              
              </>
            }
          />
          <Route path='/profile' element={<Profile />} />

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

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/payment" element={<Payment />} />

          {/* 404 */}
          <Route path="*" element={<h1>Page Not Found</h1>} />

        </Routes>
         
      </div>
       <About />
        <Footer/>
    </BrowserRouter>
  );
};

export default App;