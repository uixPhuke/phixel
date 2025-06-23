import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/logo.png'
import SearchBar from '../../pages/SearchBar/SearchBar'

const Navbar = () => {
  return (
    <header className={`fixed w-full bg-secondary  shadow-md z-50 p-4`}>
      <div className="flex mx-auto items-center justify-between">
        <div className="flex items-center">
          <Link to='/'>
          <img src={logo} className='h-8' alt="uixLogo"/></Link>
        </div>
        {/* Search Bar */}
        <SearchBar />
      </div>


    </header>
  )
}

export default Navbar
