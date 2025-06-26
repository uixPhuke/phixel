import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

import img1 from '../../assets/img1.png';
import img2 from '../../assets/img2.png';
import img3 from '../../assets/img3.png';

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
      <div className="hidden lg:flex absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
        <button className="bg-secondary text-primary px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition">
          SHOP NOW
        </button>
      </div>

      {/* Button - Mobile & Tablet (below image) */}
      <div className="lg:hidden flex justify-center mt-6">
        <button className="bg-secondary text-primary px-6 py-3 rounded-full shadow-lg hover:shadow-2xl transition">
          SHOP NOW
        </button>
      </div>
    </div>
  );
};

export default Hero;
