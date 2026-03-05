import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { useDispatch ,useSelector} from "react-redux";
import logo from "../../assets/logo.png";
import SearchBar from "../../pages/SearchBar/SearchBar";
import { FaRegHeart, FaUserCircle } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsBorderStyle } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";
import { getWishlist } from "../../actions/wishlistActions";
import { logout } from "../../actions/userActions";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Track visibility of the header
  const [lastScrollY, setLastScrollY] = useState(0); // Track the last scroll position
  const { cartItems, guestCartItems, totalQuantity } = useSelector(
  (state) => state.cart
);
const { isLogin } = useSelector((state) => state.user);

const handleLogout = () => {
  dispatch(logout());
  localStorage.removeItem("token");
};

const cartCount = cartItems.length > 0
  ? totalQuantity
  : guestCartItems.reduce((sum, item) => sum + item.quantity, 0);
//wishlist load on navbar load
const dispatch = useDispatch();

useEffect(() => {
  const token = localStorage.getItem("token");
  if (token) {
    dispatch(getWishlist());
  }
}, []);





  useEffect(() => {
    // console.log('this')
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header
      className={`fixed text-primary top-0 left-0 w-full z-50 p-4 transition-all duration-300 ${
        isScrolled
          ? "bg-secondary shadow-md opacity-90"
          : "bg-secondary shadow-none opacity-100"
      } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
    >
      <div className="flex mx-auto items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} className="h-16" alt="uixLogo" />
          </Link>
        </div>
        {/* Navigation Links for Large Screens */}
        <nav className="text-primary  hidden lg:flex lg:items-center space-x-20 text-xs  transition-all duration-300">
        <Link to="/products?sort=newest" className="hover:text-accent">
  New & Featured
</Link>

<Link to="/products?category=men" className="hover:text-accent">
  MEN
</Link>

<Link to="/products?category=women" className="hover:text-accent">
  WOMEN
</Link>

<Link to="/products?category=kids" className="hover:text-accent">
  KIDS
</Link>

<Link to="/products?category=unisex" className="hover:text-accent">
  UNISEX
</Link>
        </nav>
        <div className="flex flex-row items-center space-x-6">
          {/* Search Bar */}
          <SearchBar />
          {/* User Profile */}
          <Link to="/profile" className="hover:text-accent ">
            <FaUserCircle size={24} className="text-sm transition-all duration-300" />
          </Link>
          {/* Wishlist */}
          <Link to="/wishlist" className="hover:text-accent ">
            <FaRegHeart size={24} className=" transition-all duration-300 text-sm" />
          </Link>
         {/*Cart */}
          <Link to="/cart" className="relative hover:text-accent ">
            <IoCartOutline size={24} className="text-sm transition-all duration-300 " />
            {cartCount > 0 && (
  <span className="absolute -top-2 -right-2 bg-primary text-secondary text-xs rounded-full w-6 h-6 flex items-center justify-center">
    {cartCount}
  </span>
)}
          </Link>
          
          
          {/* Hamburger Menu for Small Screens*/}
          <div className="lg:hidden z-50">
            <button onClick={toggleMenu}  aria-label="Toggle Menu" className="text-primary hover:text-accent focus:outline-none cursor-pointer">
              {isOpen ? (
                <AiOutlineClose size={24}  />
              ) : (
                <AiOutlineMenu size={24}  />
              )}
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-y-0 right-0 w-full  bg-secondary shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } lg:hidden`}
        >
          <nav className="flex flex-col p-12 pt-24 space-y-6 text-primary  bg-secondary text-md">
            <Link to="/new" onClick={toggleMenu} className="hover:text-accent transition-all duration-300">
              New & Featured
            </Link>
            <Link to="/men" onClick={toggleMenu} className="hover:text-accent transition-all duration-300">
              Men
            </Link>
            <Link to="/women" onClick={toggleMenu} className="hover:text-accent transition-all duration-300">
              Women
            </Link>
            <Link to="/kids" onClick={toggleMenu} className="hover:text-accent transition-all duration-300">
              Kids
            </Link>
            <Link to="/unisex" onClick={toggleMenu} className="hover:text-accent transition-all duration-300">
              Unisex
            </Link>
            
          </nav>

          <div className="p-12 text-sm bg-secondary  text-primary">
            <Link
              to="/"
              className="flex items-center space-x-2 mb-4"
              onClick={toggleMenu}
            >
              <img src={logo} alt="Jordan" className="h-24" />
              
            </Link>
            <p>
              Become a Member for the best product and Design{" "}
              <Link to="/learn-more" className="underline" onClick={toggleMenu}>
                Learn more
              </Link>
            </p>
            <div className="flex space-x-4 mt-4">
             
                {isLogin ? (
  <button
    onClick={() => {
      handleLogout();
      toggleMenu();
    }}
    className="bg-primary text-secondary px-6 py-2 rounded-full"
  >
    Logout
  </button>
) : (
  <Link
    to="/login"
    className="bg-primary text-secondary px-6 py-2 rounded-full"
    onClick={toggleMenu}
  >
    Join Us
  </Link>
)}
             
            </div>
           
          </div>
          <div className="flex flex-col p-12 space-y-6 text-primary  bg-secondary text-md">
              {/*orders*/}
              <Link to="/orders" onClick={toggleMenu} className="hover:text-accent flex items-center space-x-6">
              <BsBorderStyle className="text-sm transition-all duration-300 text-md" /> <span>Orders</span>
            </Link>
            {/* User Profile */}
          <Link to="/profile" onClick={toggleMenu} className="hover:text-accent flex items-center space-x-6">
            <FaUserCircle className="text-sm transition-all duration-300" /><span>Profile</span>
          </Link>
          {/* Wishlist */}
          <Link to="/wishlist" onClick={toggleMenu} className="hover:text-accent flex items-center space-x-6 ">
            <FaRegHeart className=" transition-all duration-300 text-sm" /><span>Wishlist</span>
          </Link>
         {/*Cart */}
          <Link to="/cart" onClick={toggleMenu} className=" hover:text-accent flex items-center space-x-6 ">
            <IoCartOutline className="text-sm transition-all duration-300 text-md" />
            <span>Cart</span>
          </Link>
              

            </div>
        </div>
      </div>
  
    </header>
  );
};

export default Navbar;
   




{/*<div className="bg-red-500 md:bg-blue-500 lg:bg-green-500">
  This will be:
  - Red on mobile
  - Blue on iPad portrait 
  - Green on iPad landscape 
</div>
 /*/}
