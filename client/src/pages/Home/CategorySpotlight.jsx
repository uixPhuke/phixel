import React from "react";
import { Link } from "react-router-dom";
import tshirtsImg from "../../assets/categories/tshirtsImg.png";
import shirtsImg from "../../assets/categories/shirtsImg.png";
import jeansImg from "../../assets/categories/jeansImg.png";
import jacketsImg from "../../assets/categories/jacketsImg.png";
import hoodiesImg from "../../assets/categories/hoodie.png";
import dressesImg from "../../assets/categories/dressesImg.png";
import skirtsImg from "../../assets/categories/skirtsImg.png";
import shortsImg from "../../assets/categories/shortsImg.png";
import pantsImg from "../../assets/categories/pantsImg.png";
import ethnicImg from "../../assets/categories/ethenticImg.png";
import formalImg from "../../assets/categories/formal.png";
import casualImg from "../../assets/categories/casualImg.png";
import activewearImg from "../../assets/categories/activewearImg.png";

const categories = [
  { name: "Tshirts", img: tshirtsImg, link: "/products?category=tshirts" },
  { name: "Shirts", img: shirtsImg, link: "/products?category=shirts" },
  { name: "Jeans", img: jeansImg, link: "/products?category=jeans" },
  { name: "Jackets", img: jacketsImg, link: "/products?category=jackets" },
  { name: "Hoodies", img: hoodiesImg, link: "/products?category=hoodies" },
  { name: "Dresses", img: dressesImg, link: "/products?category=dresses" },
  { name: "Skirts", img: skirtsImg, link: "/products?category=skirts" },
  { name: "Shorts", img: shortsImg, link: "/products?category=shorts" },
  { name: "Pants", img: pantsImg, link: "/products?category=pants" },
  { name: "Ethnic", img: ethnicImg, link: "/products?category=ethnic" },
  { name: "Formal", img: formalImg, link: "/products?category=formal" },
  { name: "Casual", img: casualImg, link: "/products?category=casual" },
  { name: "Activewear", img: activewearImg, link: "/products?category=activewear" },
];
const CategorySpotlight = () => {
  return (
    <section className="bg-secondary py-20">

      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-6xl font-secondary font-bold text-primary tracking-widest">
          SPOTLIGHT
        </h2>

        <p className="text-accent mt-4 text-lg">
          Explore categories designed for modern everyday style.
        </p>
      </div>

      {/* Category Grid */}
     <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-y-12 gap-x-6 px-6">
  {categories.map((cat, index) => (
    <Link
      key={index}
      to={cat.link}
      className="w-1/2 sm:w-1/4 md:w-1/6 lg:w-[12.5%] flex flex-col items-center group"
    >
      <div className="w-32 h-32 flex items-center justify-center">
        <img
          src={cat.img}
          alt={cat.name}
          className="object-contain h-full group-hover:scale-110 transition duration-300"
        />
      </div>

      <p className="text-xs text-primary mt-3 text-center">
        {cat.name}
      </p>
    </Link>
  ))}
</div>
    </section>
  );
};

export default CategorySpotlight;