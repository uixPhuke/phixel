import React, { useState } from 'react';
import {
  PRODUCT_CATEGORIES,
  GENDER_TYPES,
  SORT_OPTIONS
} from '../../constants/productConstants';

/* Smooth Accordion Section */
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-3">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-sm font-medium text-gray-900"
      >
        {title}
        <span
          className={`transform transition-transform duration-300 ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>

      {/* Smooth transition */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
};

const ProductFilters = ({ filters, sort, onFilterChange, onSortChange }) => {
  /* Local price state (Nike-style apply) */
  const [minPrice, setMinPrice] = useState(filters.priceMin || 0);
  const [maxPrice, setMaxPrice] = useState(filters.priceMax || 6000);

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const applyPriceFilter = () => {
    onFilterChange({
      priceMin: minPrice,
      priceMax: maxPrice
    });
  };

  const clearFilters = () => {
    onFilterChange({
      category: '',
      gender: '',
      size: '',
      inStock: false,
      priceMin: '',
      priceMax: ''
    });
  };

  return (
    <aside className="w-full px-5 lg:px-0 lg:w-80 lg:sticky lg:top-24 h-fit bg-white">


      {/* Header */}
      <div className="flex flex-row-reverse justify-between items-center mb-4">
        {/*<h2 className="text-md font-semibold">Filters</h2>*/}
        <button
          onClick={clearFilters}
          className="
            text-xs px-3 py-1 rounded-full
            border border-gray-300
            hover:border-black hover:bg-gray-50
            transition
          "
        >
          Clear All
        </button>
      </div>

      {/* SORT */}
      <div className="mb-4">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full border border-gray-300 px-3 py-2 text-sm"
        >
          {SORT_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              Sort by: {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* CATEGORY */}
      <FilterSection title="Category">
        {PRODUCT_CATEGORIES.map(category => (
          <label
            key={category}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.category === category}
              onChange={() =>
                handleFilterChange(
                  'category',
                  filters.category === category ? '' : category
                )
              }
              className="accent-black"
            />
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </label>
        ))}
      </FilterSection>

      {/* SIZE */}
      <FilterSection title="Size">
        {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => (
          <label
            key={size}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.size === size}
              onChange={() =>
                handleFilterChange(
                  'size',
                  filters.size === size ? '' : size
                )
              }
              className="accent-black"
            />
            {size}
          </label>
        ))}
      </FilterSection>

      {/* GENDER */}
      <FilterSection title="Gender">
        {GENDER_TYPES.map(gender => (
          <label
            key={gender}
            className="flex items-center gap-2 text-sm cursor-pointer"
          >
            <input
              type="checkbox"
              checked={filters.gender === gender}
              onChange={() =>
                handleFilterChange(
                  'gender',
                  filters.gender === gender ? '' : gender
                )
              }
              className="accent-black"
            />
            {gender}
          </label>
        ))}
      </FilterSection>

      {/* PRICE */}
      <FilterSection title="Shop By Price">

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500">Min</label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              className="w-full border border-gray-300 px-2 py-1 text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Max</label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full border border-gray-300 px-2 py-1 text-sm"
            />
          </div>
        </div>

        <input
          type="range"
          min="0"
          max="6000"
          step="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full mt-2"
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>₹0</span>
          <span>₹6000</span>
        </div>

        <button
          onClick={applyPriceFilter}
          className="
            w-full mt-3 py-2 text-sm
            border border-gray-300
            hover:border-black
            transition
          "
        >
          Apply
        </button>
      </FilterSection>

      {/* AVAILABILITY */}
      <FilterSection title="Availability">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock || false}
            onChange={(e) =>
              handleFilterChange('inStock', e.target.checked)
            }
            className="accent-black"
          />
          In Stock Only
        </label>
      </FilterSection>

    </aside>
  );
};

export default ProductFilters;
