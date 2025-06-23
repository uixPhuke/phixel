import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div className='bg-secondary'>
      <nav>
        <Link to='/men' className='font-'>MEN</Link>
      </nav>
      
    </div>
  )
}

export default Navbar
