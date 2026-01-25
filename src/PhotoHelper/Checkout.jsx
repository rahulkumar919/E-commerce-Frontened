import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Checkout = () => {
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    paymentMethod: "COD",
  });

  const navigate = useNavigate();

  // ✅ Load Checkout Items
  useEffect(() => {
    const cartItems =
      JSON.parse(localStorage.getItem("checkoutItems")) ||
      JSON.parse(localStorage.getItem("cartItems")) ||
      [];
    setCheckoutItems(cartItems);
  }, []);

  // ✅ Total Price Calculation
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.selling * (item.quantity || 1),
    0
  );

  const total = Math.round(subtotal * 1.05); // +5% tax

  // ✅ Handle Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle Checkout
  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      toast.error("Please fill all the required fields 📝");
      return;
    }

    toast.success("🎉 Order placed successfully!");
    localStorage.removeItem("checkoutItems");
    localStorage.removeItem("cartItems");

    // Redirect to home after placing order
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <section className="w-full min-h-screen bg-gray-50 py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">
        {/* 🧾 Left Side - Address Form */}
        <div className="flex-1 bg-white shadow-md rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
            🧍 Shipping & Billing Details
          </h2>

          <form onSubmit={handlePlaceOrder} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                  placeholder="Enter Full Name "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                  placeholder="Enter The Num "
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none resize-none"
                placeholder="House No, Street, Area"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                  placeholder="Enter The City"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-red-400 outline-none"
                  placeholder="Enter The Pin "
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💳 Payment Method
              </h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                    className="accent-red-500"
                  />
                  Cash on Delivery (COD)
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="UPI"
                    checked={formData.paymentMethod === "UPI"}
                    onChange={handleChange}
                    className="accent-red-500"
                  />
                  UPI / Net Banking
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CARD"
                    checked={formData.paymentMethod === "CARD"}
                    onChange={handleChange}
                    className="accent-red-500"
                  />
                  Credit / Debit Card
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-6 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold text-base shadow-md"
            >
              Place Order →
            </button>
          </form>
        </div>

        {/* 💵 Right Side - Order Summary */}
        <div className="w-full lg:w-[35%] bg-white shadow-md rounded-2xl p-6 sm:p-8 h-fit">
          <h3 className="text-xl font-semibold text-gray-800 border-b pb-4 mb-4">
            🛍️ Order Summary
          </h3>

          {checkoutItems.length === 0 ? (
            <p className="text-gray-500 text-center py-10">
              No items selected for checkout.
            </p>
          ) : (
            <div className="space-y-4">
              {checkoutItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item?.productImage?.[0]}
                      alt={item?.productName}
                      className="w-14 h-14 object-contain bg-gray-50 rounded-md border"
                    />
                    <div>
                      <p className="text-gray-800 font-medium">
                        {item?.productName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Qty: {item?.quantity || 1}
                      </p>
                    </div>
                  </div>
                  <p className="text-red-500 font-semibold">
                    ₹{item.selling * (item.quantity || 1)}
                  </p>
                </div>
              ))}

              {/* Summary Totals */}
              <div className="mt-4 border-t pt-4 space-y-2 text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{Math.round(subtotal * 0.05)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Total</span>
                  <span className="text-red-500">₹{total}</span>
                </div>
              </div>
            </div>
          )}

          <Link
            to="/cart"
            className="block text-center mt-6 text-gray-600 hover:text-gray-800 text-sm"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
