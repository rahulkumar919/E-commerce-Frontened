import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SummaryApi from "../../common";
import { toast } from "react-toastify";
import { FaArrowLeft } from "react-icons/fa";

const AllCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all categories with product count
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getAllCategories.url, {
        method: SummaryApi.getAllCategories.method,
      });

      const result = await response.json();

      if (result.success) {
        // Filter only active categories
        const activeCategories = result.data.filter(cat => cat.isActive);
        setCategories(activeCategories);
      } else {
        toast.error("Failed to load categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
              All Categories
            </h1>
            <p className="text-gray-600">
              Browse products by category
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            <FaArrowLeft />
            Back to Home
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array(12)
              .fill()
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
                >
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <p className="text-gray-500 text-lg mb-4">No categories available</p>
            <Link
              to="/"
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Go back to home
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/product-category/${encodeURIComponent(category.name)}`}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Category Image */}
                <div className="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden p-4">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="text-6xl">📦</div>
                  )}
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <h3 className="font-bold text-base text-gray-800 truncate mb-1 group-hover:text-red-600 transition-colors">
                    {category.name}
                  </h3>
                  
                  {category.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-2 border-t">
                    <span className="text-xs text-gray-600">
                      {category.productCount || 0} items
                    </span>
                    <span className="text-xs text-red-500 font-medium group-hover:translate-x-1 transition-transform">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AllCategoriesPage;
