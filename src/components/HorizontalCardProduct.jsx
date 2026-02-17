import React, { useEffect, useRef, useState, useContext } from "react";
import fetchCategoryWiseProduct from "../PhotoHelper/fetchCategoryWiseProduct";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { Context } from "../App"; // ✅ Import context
import addTocart from "../PhotoHelper/addToCard";

const HorizontalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedItems, setAddedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollElement = useRef(null);
  const navigate = useNavigate();

  // ✅ Access global cart counter and user
  const { user, fetchUserAddToCount } = useContext(Context);

  const loadingList = new Array(6).fill(null);

  // ✅ Fetch products
  const fetchData = async () => {
    try {
      setLoading(true);
      const categoryProduct = await fetchCategoryWiseProduct(category);
      setData(categoryProduct?.data || []);
    } catch (err) {
      console.error("Error fetching category products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  // ✅ Scroll handlers
  const scrollLeft = () =>
    scrollElement.current.scrollBy({ left: -400, behavior: "smooth" });
  const scrollRight = () =>
    scrollElement.current.scrollBy({ left: 400, behavior: "smooth" });

  // ✅ Add to Cart - Check if user is logged in first
  const handleAddToCart = async (e, product) => {
    // Check if user is logged in
    if (!user) {
      toast.warning("Please login to add items to cart");
      navigate("/login");
      return;
    }

    const alreadyAdded = addedItems.includes(product._id);
    if (alreadyAdded) {
      toast.info("This item is already in your cart!");
      navigate("/cart");
      return;
    }

    // Call backend API to add to cart
    const result = await addTocart(e, product._id);
    
    if (result?.success) {
      // Update local added state
      setAddedItems((prev) => [...prev, product._id]);
      
      // Update cart count
      if (fetchUserAddToCount) {
        fetchUserAddToCount();
      }

      // Redirect to cart after short delay
      setTimeout(() => navigate("/cart"), 500);
    }
  };

  return (
    <>
      <section className="w-full py-8 bg-gray-50">
        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-10 mb-5">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 capitalize">
            {heading || category}
          </h2>
          <Link
            to={`/product-category?category=${encodeURIComponent(category)}`}
            className="text-sm text-red-500 hover:text-red-600"
          >
            View All →
          </Link>
        </div>

        {/* Product Row */}
        <div className="relative w-full">
          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 z-10 hidden sm:flex items-center justify-center"
          >
            <FaChevronLeft />
          </button>

          {/* Product List */}
          <div
            ref={scrollElement}
            className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar px-4 sm:px-8"
          >
            {loading &&
              loadingList.map((_, i) => (
                <div
                  key={i}
                  className="w-[220px] h-[220px] bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
                ></div>
              ))}

            {!loading &&
              data.map((product) => {
                const isAdded = addedItems.includes(product._id);
                return (
                  <div
                    key={product._id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all flex-shrink-0 w-[220px] md:w-[260px] border group cursor-pointer hover:scale-105 duration-300"
                  >
                    {/* Image */}
                    <div className="h-[160px] w-full overflow-hidden rounded-t-xl bg-gray-50 flex items-center justify-center">
                      <img
                        src={product?.productImage?.[0]}
                        alt={product?.productName}
                        className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="text-sm md:text-base font-semibold text-gray-800 truncate">
                        {product?.productName}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {product?.brandName}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-red-500 font-semibold">
                          ₹{product?.selling}
                        </p>
                        <p className="text-gray-400 line-through text-xs">
                          ₹{product?.price}
                        </p>
                      </div>

                      {/* Add to Cart */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(e, product);
                        }}
                        disabled={isAdded}
                        className={`w-full mt-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                          isAdded
                            ? "bg-green-500 text-white cursor-default"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        {isAdded ? "Added ✓" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white shadow-md p-3 rounded-full hover:bg-gray-100 z-10 hidden sm:flex items-center justify-center"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>

      {/* Product Zoom Modal */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[90%] sm:w-[600px] max-h-[85vh] overflow-y-auto relative animate-zoomIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>

            {/* Modal Image */}
            <Link
              to={`/product-details/${selectedProduct?._id}`}
              className="w-full h-[300px] sm:h-[350px] bg-gray-100 flex items-center justify-center rounded-t-2xl overflow-hidden"
            >
              <img
                src={selectedProduct?.productImage?.[0]}
                alt={selectedProduct?.productName}
                className="w-full h-full object-contain"
              />
            </Link>

            {/* Info */}
            <div className="p-5">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedProduct?.productName}
              </h2>
              <p className="text-gray-500 mt-1 capitalize">
                {selectedProduct?.brandName}
              </p>

              <div className="flex items-center gap-3 mt-3">
                <p className="text-red-500 text-xl font-semibold">
                  ₹{selectedProduct?.selling}
                </p>
                <p className="text-gray-400 line-through text-sm">
                  ₹{selectedProduct?.price}
                </p>
              </div>

              <p className="mt-4 text-gray-600 text-sm leading-relaxed">
                {selectedProduct?.description ||
                  "No description available for this product."}
              </p>

              <button
                onClick={(e) => handleAddToCart(e, selectedProduct)}
                disabled={addedItems.includes(selectedProduct._id)}
                className={`w-full mt-6 py-3 rounded-lg font-semibold text-white text-base transition-all ${
                  addedItems.includes(selectedProduct._id)
                    ? "bg-green-500 cursor-default"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {addedItems.includes(selectedProduct._id)
                  ? "Added ✓"
                  : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HorizontalCardProduct;
