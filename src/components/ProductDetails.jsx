import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SummaryApi from "../../common";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams(); // ✅ get product id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product details
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.getProductByid.url}/${id}`);
      const data = await response.json();

      if (data.success) {
        setProduct(data.data);
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

  useEffect(() => {
    fetchProduct();
  }, [id]);

  //  Add to cart (for now using localStorage)
  const handleAddToCart = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const alreadyAdded = cartItems.some((item) => item._id === product._id);

    if (alreadyAdded) {
      toast.info("This product is already in your cart!");
      return;
    }

    localStorage.setItem(
      "cartItems",
      JSON.stringify([...cartItems, { ...product, quantity: 1 }])
    );
    toast.success(`${product.productName} added to cart 🛒`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) return null;

  return (
    <section className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:flex gap-10">
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
              onClick={handleAddToCart}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                handleAddToCart();
                navigate("/checkout");
              }}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
