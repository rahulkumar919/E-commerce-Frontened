import React, { useEffect, useState } from "react";
import SummaryApi from "../../common";
import { Link } from "react-router-dom";

const CategoryList = () => {
  const [categoryProduct, setCategoryProduct] = useState([]);

  //  Fetch all categories
  const fetchCategoryProduct = async () => {
    try {
      const response = await fetch(SummaryApi.GetDataCategory.url);
      const dataResponse = await response.json();
      setCategoryProduct(dataResponse.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategoryProduct();
  }, []);

  return (
    <section className="w-full bg-gradient-to-r from-white via-gray-50 to-gray-100 py-8 md:py-10">
      <div className="container mx-auto px-4">
        {/* ✨ Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-wide">
            🛍️ Shop by <span className="text-red-600">Category</span>
          </h2>
          <Link
            to="/all-categories"
            className="text-sm text-red-500 hover:text-red-600 font-medium transition-all duration-300"
          >
            View All →
          </Link>
        </div>

        {/* 🌈 Category Slider */}
        <div
          className="
            flex gap-6 overflow-x-auto scrollbar-none 
            snap-x snap-mandatory scroll-smooth py-4
          "
        >
          {categoryProduct.length > 0 ? (
            categoryProduct.map((product, index) => (
              <Link
                key={index}
                to={`/product-category/${encodeURIComponent(product?.category)}`}
                className="
                  flex flex-col items-center justify-center
                  min-w-[90px] md:min-w-[110px] snap-start
                  group transition-transform duration-300 ease-out
                  hover:scale-110 hover:-translate-y-1
                "
              >
                <div
                  className="
                    w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center
                    bg-gradient-to-tr from-gray-100 to-gray-200
                    shadow-md group-hover:shadow-lg
                    border border-gray-100 hover:border-red-400
                    transition-all duration-300
                  "
                >
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.category}
                    loading="lazy"
                    className="
                      h-12 md:h-14 object-contain 
                      mix-blend-multiply transform group-hover:scale-110 transition-transform
                    "
                  />
                </div>
                <p
                  className="
                    text-center text-sm md:text-base mt-3 capitalize 
                    text-gray-700 font-medium group-hover:text-red-600
                    transition-colors duration-300
                  "
                >
                  {product?.category}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">
              No categories available 😢
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryList;
