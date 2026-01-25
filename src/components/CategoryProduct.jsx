import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import SummaryApi from "../../common";
import { toast } from "react-toastify";
import { FaShoppingCart } from "react-icons/fa";
import { Context } from "../App";

const CategoryProduct = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(Context);

  // ✅ Fetch products by category
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.CategoryWiseProduct.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ category }), // ✅ Send category in body, not URL
      });

      const data = await response.json();
      console.log("✅ Category API response:", data);

      if (data.success) {
        setProducts(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch products");
        setProducts([]);
      }
    } catch (error) {
      console.error("❌ Error fetching category products:", error);
      toast.error("Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (category) fetchProducts();
  }, [category]);

  // ✅ Add to cart (localStorage)
  const handleAddToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const alreadyAdded = cartItems.some((item) => item._id === product._id);

    if (alreadyAdded) {
      toast.info("This product is already in your cart!");
      return;
    }

    cartItems.push({ ...product, quantity: 1 });
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    toast.success(`${product.productName} added to cart 🛒`);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* 🏷️ Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 capitalize">
            {category} Products
          </h2>
          <Link
            to="/"
            className="text-red-500 hover:text-red-600 font-medium text-sm"
          >
            ← Back to Home
          </Link>
        </div>

        {/* 🌀 Loading */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow animate-pulse h-64"
              ></div>
            ))}
          </div>
        )}

        {/* ❌ No Products */}
        {!loading && products.length === 0 && (
          <div className="bg-white shadow-md p-8 text-center rounded-xl">
            <p className="text-gray-600 text-lg">
              No products found in this category 😢
            </p>
          </div>
        )}

        {/* 🛍️ Product Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-3 flex flex-col group cursor-pointer hover:scale-105"
              >
                <Link
                  to={`/product-details/${product._id}`}
                  className="block h-40 flex items-center justify-center overflow-hidden rounded-lg bg-gray-50"
                >
                  <img
                    src={product?.productImage?.[0]}
                    alt={product?.productName}
                    className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                </Link>

                <div className="mt-3 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800 truncate">
                      {product.productName}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {product.brandName}
                    </p>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div>
                      <p className="text-red-500 font-semibold">
                        ₹{product.selling}
                      </p>
                      <p className="text-gray-400 line-through text-xs">
                        ₹{product.price}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
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
    </section>
  );
};

export default CategoryProduct;
