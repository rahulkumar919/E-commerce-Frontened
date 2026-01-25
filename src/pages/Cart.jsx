import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart from localStorage
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartItems")) || [];
    const updated = items.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
    }));
    setCartItems(updated);
  }, []);

  //  Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  //  Increase / Decrease quantity
  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  //  Remove item
  const removeItem = (id) => {
    const updated = cartItems.filter((item) => item._id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    toast.success("Item removed from cart 🗑️");
  };

  //  Subtotal calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.selling * item.quantity,
    0
  );

  //  Redirect on Buy Now
  const handleBuyNow = (item) => {
    localStorage.setItem("checkoutItem", JSON.stringify(item));
    toast.success(`Proceeding to checkout for ${item.productName} 🛒`);
    navigate("/checkout");
  };

  //  Redirect on Cart Checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.info("Your cart is empty!");
      return;
    }
    localStorage.setItem("checkoutItems", JSON.stringify(cartItems));
    navigate("/checkout");
  };

  return (
    <section className="w-full min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* 🛒 Cart Products Section */}
        <div className="flex-1 bg-white shadow-md rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            🛍️ Your Cart ({cartItems.length})
          </h2>

          {/* Empty Cart */}
          {cartItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-6">
                Your cart is empty 😢
              </p>
              <Link
                to="/"
                className="inline-block px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm sm:text-base font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-4 w-full sm:w-2/3">
                    <img
                      src={item?.productImage?.[0]}
                      alt={item?.productName}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-contain bg-gray-50 rounded-lg border"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item?.productName}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {item?.brandName}
                      </p>

                      {/* Price & Discount */}
                      <div className="flex items-center gap-3 mt-2">
                        <p className="text-red-500 font-bold text-lg">
                          ₹{item.selling}
                        </p>
                        <p className="text-gray-400 line-through text-sm">
                          ₹{item.price}
                        </p>
                        <span className="text-green-600 font-semibold text-sm">
                          {Math.round(
                            ((item.price - item.selling) / item.price) * 100
                          )}
                          % off
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-bold"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-700">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, +1)}
                      className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-center sm:items-end gap-3">
                    <p className="text-lg font-semibold text-gray-800">
                      ₹{item.selling * item.quantity}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleBuyNow(item)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-lg shadow"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={() => removeItem(item._id)}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-semibold rounded-lg"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 💵 Summary Section */}
        {cartItems.length > 0 && (
          <div className="w-full lg:w-[30%] bg-white shadow-md rounded-2xl p-6 sm:p-8 h-fit">
            <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
              🧾 Price Summary
            </h3>
            <div className="space-y-3 text-gray-700 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-green-600 font-medium">FREE</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>₹{Math.round(subtotal * 0.05)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span className="text-red-500">
                  ₹{Math.round(subtotal * 1.05)}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold text-base shadow-md"
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/"
              className="block text-center mt-4 text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
