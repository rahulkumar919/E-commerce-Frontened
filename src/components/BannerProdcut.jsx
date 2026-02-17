// src/components/BannerProduct.jsx
import { useState, useEffect } from "react";
import SummaryApi from "../../common";
import { Link } from "react-router-dom";

const BannerProduct = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch active banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(SummaryApi.getActiveBanners.url, {
          method: SummaryApi.getActiveBanners.method,
        });

        const data = await response.json();

        if (data.success && data.data.length > 0) {
          setBanners(data.data);
        }
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  // Auto slide every 5 seconds
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Manual controls
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Loading state
  if (loading) {
    return (
      <section className="relative w-full overflow-hidden bg-gray-100">
        <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </section>
    );
  }

  // No banners state
  if (banners.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <section className="relative w-full overflow-hidden bg-gray-50">
      <div className="relative w-full h-[220px] sm:h-[320px] md:h-[400px] lg:h-[460px]">
        {banners.map((banner, index) => {
          // Use mobile image on small screens if available, otherwise use desktop image
          const isMobile = window.innerWidth < 768;
          const imageUrl = isMobile && banner.mobileImage 
            ? banner.mobileImage 
            : banner.image;

          return (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
                index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Image */}
              <img
                src={imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

              {/* Content */}
              <div className="absolute bottom-10 left-6 sm:left-12 text-white z-20">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-md">
                  {banner.title}
                </h2>
                {banner.description && (
                  <p className="text-sm sm:text-base md:text-lg mt-2 opacity-90 max-w-md">
                    {banner.description}
                  </p>
                )}
                {banner.link && (
                  <Link
                    to={banner.link}
                    className="inline-block mt-4 px-5 py-2 sm:px-6 sm:py-3 bg-red-500 hover:bg-red-600 rounded-lg text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition"
                  >
                    Shop Now
                  </Link>
                )}
              </div>
            </div>
          );
        })}

        {/* Navigation Arrows - Only show if more than 1 banner */}
        {banners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-30"
              aria-label="Previous banner"
            >
              ❮
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition z-30"
              aria-label="Next banner"
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
                  aria-label={`Go to banner ${i + 1}`}
                ></div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BannerProduct;
