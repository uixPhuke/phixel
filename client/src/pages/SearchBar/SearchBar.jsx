import React from 'react'
import { HiOutlineSearch } from "react-icons/hi";

const SearchBar = () => {
  return (
     
     <div className="flex items-center">
     <div className="relative">
       <input
         type="text"
         placeholder="search"
         className="bg-accent text-primary pl-4 pr-8 py-2 rounded-full text-sm focus:outline-none transition-all duration-300"
       />
       <HiOutlineSearch className="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary" />
     </div>
   </div>
  )
}

export default SearchBar
