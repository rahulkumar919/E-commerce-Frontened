// src/components/BannerProduct.jsx
import React, { useState, useEffect } from "react";
import image1 from "../assets/banner/img1_mobile.jpg";
import image2 from "../assets/banner/img2_mobile.webp";
import image3 from "../assets/banner/img3.jpg";
import image4 from "../assets/banner/img4.jpg";
import image5 from "../assets/banner/img5.webp";

const BannerProduct = () => {
  const banners = [image1, image2, image3, image4, image5];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Manual controls
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-50">
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px]">
        {banners.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Image */}
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover object-center"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {/* Content */}
            <div className="absolute bottom-10 left-6 sm:left-12 text-white z-20">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md">
                ✨ Exclusive Offer #{index + 1}
              </h2>
              <p className="text-sm sm:text-base md:text-lg mt-2 opacity-90 max-w-md">
                Discover amazing deals and top-rated products today!
              </p>
              <button className="mt-4 px-5 py-2 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition">
                Shop Now
              </button>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-30"
        >
          ❮
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-30"
        >
          ❯
        </button>

        {/* Dots Indicator */}

        

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {banners.map((_, i) => (
            <div
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`cursor-pointer w-3 h-3 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BannerProduct;
