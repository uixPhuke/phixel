import React from 'react'
import { HiOutlineSearch } from "react-icons/hi";

const SearchBar = () => {
  return (
     
     <div className="flex items-center  border-primary border-0 rounded-full shadow-md ">
     <div className="relative">
       <input
         type="text"
         placeholder="search"
         className="bg-secondary text-primary pl-4 pr-8 py-2 rounded-full text-xs focus:outline-none transition-all duration-300 hover:bg-accent focus:bg-accent focus:border-primary w-full"
       />
       <HiOutlineSearch className="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary text-sm " />
       
     </div>
   </div>
  )
}

export default SearchBar
