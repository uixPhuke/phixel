import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import SearchBar from '../../pages/SearchBar/SearchBar'
import { FaRegHeart, FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <header className={`fixed w-full bg-secondary shadow-md  z-50 p-6 pl-12 pr-12`}>
      <div className="flex mx-auto items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to='/'>
          <img src={logo} className='h-16' alt="uixLogo"/></Link>
        </div>
        {/* Navigation Links for Large Screens */}
        <nav className="text-primary hidden md:flex md:items-center space-x-20 text-xs  transition-all duration-300">
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
        
        {/* Search Bar */}
        <SearchBar />
        
        {/* Cart */}
        <Link to="/wishlist" className="hover:text-accent text-sm">
              <FaRegHeart className=" transition-all duration-300" />
        </Link>

      </div>


    </header>
  )
}

export default Navbar
