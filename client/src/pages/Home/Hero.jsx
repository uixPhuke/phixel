import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { Link } from 'react-router-dom';

import img1 from '../../assets/img1.webp';
import img2 from '../../assets/img2.webp';
import img3 from '../../assets/img3.webp';

const Hero = () => {
  return (
    <div className="relative w-full">
      {/* Image Slider */}
      <Swiper
        modules={[Autoplay, EffectFade]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        className="w-full h-auto"
      >
        {[img1, img2, img3].map((image, idx) => (
          <SwiperSlide key={idx}>
            <img
              src={image}
              alt={`slide-${idx}`}
              className="w-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Button - Desktop only (over image) */}
      <div className="hidden lg:flex absolute bottom-30 right-20 z-10">
        <Link to="/products">
          <button className="bg-secondary text-primary px-10 py-4 text-md font-semibold rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition">
            SHOP NOW
          </button>
        </Link>
      </div>

      {/* Mobile Button */}
      <div className="lg:hidden flex justify-center mt-6">
        <Link to="/products">
          <button className="bg-secondary text-primary px-8 py-3 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition">
            SHOP NOW
          </button>
        </Link>
      </div>

    </div>
  );
};

export default Hero;
