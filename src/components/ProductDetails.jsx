import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import SummaryApi from "../../common";
import { toast } from "react-toastify";
import { Context } from "../App";
import addTocart from "../PhotoHelper/addToCard";
import { FaShoppingCart } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams(); // ✅ get product id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const { user, fetchUserAddToCount } = useContext(Context);

  // ✅ Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.getProductByid.url}/${id}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
        // Fetch related products after getting product details
        fetchRelatedProducts(data.data.category, id);
      } else {
        toast.error("Product not found");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching product details");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch related products
  const fetchRelatedProducts = async (category, productId) => {
    try {
      setLoadingRelated(true);
      const response = await fetch(
        `${SummaryApi.getRelatedProducts.url}?category=${encodeURIComponent(category)}&productId=${productId}`
      );
      const data = await response.json();

      if (data.success) {
        setRelatedProducts(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching related products:", err);
    } finally {
      setLoadingRelated(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0); // Scroll to top when product changes
  }, [id]);

  //  Add to cart - Check if user is logged in first
  const handleAddToCart = async (e, productId) => {
    // Check if user is logged in
    if (!user) {
      toast.warning("Please login to add items to cart");
      navigate("/login");
      return;
    }

    // Call backend API to add to cart
    const result = await addTocart(e, productId);
    
    if (result?.success) {
      // Update cart count
      if (fetchUserAddToCount) {
        fetchUserAddToCount();
      }
    }
  };

  // Buy Now - Check if user is logged in first
  const handleBuyNow = async (e) => {
    // Check if user is logged in
    if (!user) {
      toast.warning("Please login to proceed with purchase");
      navigate("/login");
      return;
    }

    // Add to cart first
    const result = await addTocart(e, product._id);
    
    if (result?.success) {
      // Update cart count
      if (fetchUserAddToCount) {
        fetchUserAddToCount();
      }
      // Navigate to cart
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <section className="bg-gray-50 min-h-screen py-10 px-4">
      {/* Product Details Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:flex gap-10 mb-10">
        {/* 🖼️ Product Image */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={product?.productImage?.[0]}
            alt={product.productName}
            className="object-contain w-full max-w-md rounded-xl"
          />
        </div>

        {/*  Product Info */}
        <div className="flex-1 flex flex-col justify-between mt-6 md:mt-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {product.productName}
            </h2>
            <p className="text-gray-500 text-sm mt-1 capitalize">
              {product.brandName}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <p className="text-2xl font-bold text-red-500">
                ₹{product.selling}
              </p>
              <p className="text-gray-400 line-through">
                ₹{product.price}
              </p>
              <span className="bg-green-100 text-green-600 text-sm px-2 py-1 rounded-md font-medium">
                {Math.round(
                  ((product.price - product.selling) / product.price) * 100
                )}
                % off
              </span>
            </div>

            <p className="mt-6 text-gray-700 leading-relaxed">
              {product.description ||
                "No description available for this product."}
            </p>
          </div>

          {/* 🛒 Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={(e) => handleAddToCart(e, product._id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Related Products
            </h3>
            <Link
              to={`/product-category/${encodeURIComponent(product.category)}`}
              className="text-red-500 hover:text-red-600 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          {loadingRelated ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array(4)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
                  >
                    <div className="w-full h-40 bg-gray-200 rounded-lg mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all p-3 flex flex-col group cursor-pointer"
                >
                  <Link
                    to={`/product-details/${relatedProduct._id}`}
                    className="block h-40 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50"
                  >
                    <img
                      src={relatedProduct?.productImage?.[0]}
                      alt={relatedProduct?.productName}
                      className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </Link>

                  <div className="mt-3 flex flex-col flex-grow justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {relatedProduct.productName}
                      </h3>
                      <p className="text-xs text-gray-500 capitalize">
                        {relatedProduct.brandName}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <p className="text-red-500 font-semibold">
                          ₹{relatedProduct.selling}
                        </p>
                        <p className="text-gray-400 line-through text-xs">
                          ₹{relatedProduct.price}
                        </p>
                      </div>
                      <button
                        onClick={(e) => handleAddToCart(e, relatedProduct._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center gap-1 text-xs font-medium"
                      >
                        <FaShoppingCart /> Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
