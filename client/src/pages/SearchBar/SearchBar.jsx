import React from 'react';
import { HiOutlineSearch } from "react-icons/hi";

const SearchBar = () => {
  return (
    <div className="flex items-center">
      {/* Mobile & Tablet: Show only icon (hidden on desktop) */}
      <div className="lg:hidden p-2 text-primary">
        <HiOutlineSearch className="text-sm" />
      </div>

      {/* Desktop: Show full search bar (hidden on mobile/tablet) */}
      <div className="hidden lg:flex items-center border-primary border-0 rounded-full shadow-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-secondary text-primary pl-4 pr-8 py-2 rounded-full text-xs focus:outline-none transition-all duration-300 hover:bg-accent focus:bg-accent focus:border-primary w-full"
          />
          <HiOutlineSearch className="absolute top-1/2 right-2 transform -translate-y-1/2 text-primary text-sm" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;