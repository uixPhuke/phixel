import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import SearchBar from "../../pages/SearchBar/SearchBar";
import { FaRegHeart, FaUserCircle } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { BsBorderStyle } from "react-icons/bs";
import { IoCartOutline } from "react-icons/io5";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <header
      className={`fixed w-full font-secondary bg-secondary shadow-md  z-50 p-6 pl-12 pr-12`}
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
          <Link to="/men" className="hover:text-accent">
            MEN
          </Link>
          <Link to="/women" className="hover:text-accent">
            WOMEN
          </Link>
          <Link to="/kids" className="hover:text-accent">
            KIDS
          </Link>
          <Link to="/unisex" className="hover:text-accent">
            UNISEX
          </Link>
        </nav>
        <div className="flex flex-row items-center space-x-6">
          {/* Search Bar */}
          <SearchBar />
          {/* User Profile */}
          <Link to="/profile" className="hover:text-accent ">
            <FaUserCircle className="text-sm transition-all duration-300" />
          </Link>
          {/* Wishlist */}
          <Link to="/wishlist" className="hover:text-accent ">
            <FaRegHeart className=" transition-all duration-300 text-sm" />
          </Link>
         {/*Cart */}
          <Link to="/cart" className="relative hover:text-accent ">
            <IoCartOutline className="text-sm transition-all duration-300 text-md" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-secondary text-xs rounded-full w-4 h-4 flex items-center justify-center">
              1
            </span>
          </Link>
          {/* Hamburger Menu for Small Screens */}
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
          className={`fixed inset-y-0 right-0 w-full bg-secondary shadow-lg transform transition-transform duration-300 ease-in-out z-40 ${
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

          <div className="p-12 text-sm text-primary">
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
             
                <Link
                  to="/login"
                  className="bg-primary text-secondary px-6 py-2 rounded-full"
                  onClick={toggleMenu}>
                  Join Us
                </Link>
             
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
