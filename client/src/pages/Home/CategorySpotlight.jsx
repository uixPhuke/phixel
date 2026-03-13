import React from "react";
import { Link } from "react-router-dom";

const categories = [
  { name: "T-Shirts", img: "/categories/tshirt.png", link: "/products?category=tshirts" },
  { name: "Shirts", img: "/categories/shirt.png", link: "/products?category=shirts" },
  { name: "Hoodies", img: "/categories/hoodie.png", link: "/products?category=hoodies" },
  { name: "Jackets", img: "/categories/jacket.png", link: "/products?category=jackets" },
  { name: "Shorts", img: "/categories/shorts.png", link: "/products?category=shorts" },
  { name: "Caps", img: "/categories/cap.png", link: "/products?category=caps" },
  { name: "Sneakers", img: "/categories/shoes.png", link: "/products?category=shoes" },
  { name: "Accessories", img: "/categories/accessories.png", link: "/products?category=accessories" },
  { name: "Streetwear", img: "/categories/streetwear.png", link: "/products?category=streetwear" },
  { name: "Minimal", img: "/categories/minimal.png", link: "/products?category=minimal" },
  { name: "Summer", img: "/categories/summer.png", link: "/products?category=summer" },
  { name: "Winter", img: "/categories/winter.png", link: "/products?category=winter" },
  { name: "Limited", img: "/categories/limited.png", link: "/products?category=limited" },
  { name: "Sportswear", img: "/categories/sportswear.png", link: "/products?category=sportswear" },
  { name: "Gym Wear", img: "/categories/gym.png", link: "/products?category=gym" },
  { name: "New Arrivals", img: "/categories/new.png", link: "/products?sort=newest" },
];

const CategorySpotlight = () => {
  return (
    <section className="bg-secondary py-20">

      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-primary tracking-widest">
          SPOTLIGHT
        </h2>

        <p className="text-accent mt-4 text-lg">
          Explore categories designed for modern everyday style.
        </p>
      </div>

      {/* Category Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-4 md:grid-cols-8 gap-y-12 gap-x-6 px-6">

        {categories.map((cat, index) => (
          <Link
            key={index}
            to={cat.link}
            className="flex flex-col items-center group"
          >
            <div className="w-16 h-16 flex items-center justify-center">

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