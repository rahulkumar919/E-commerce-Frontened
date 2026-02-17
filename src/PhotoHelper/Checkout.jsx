import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../App";
import SummaryApi from "../../common";

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
  const [processing, setProcessing] = useState(false);

  const navigate = useNavigate();
  const { user, fetchUserAddToCount } = useContext(Context);

  // ✅ Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.warning("Please login to proceed with checkout");
      navigate("/login");
    }
  }, [user, navigate]);

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

  // ✅ Handle Razorpay Payment
  const handleRazorpayPayment = async (orderData) => {
    try {
      console.log("🔄 Creating Razorpay order...");
      console.log("💰 Amount:", total);

      // Create Razorpay order
      const orderResponse = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ amount: total }),
      });

      const orderResult = await orderResponse.json();
      console.log("📦 Order Response:", orderResult);

      if (!orderResult.success) {
        console.error("❌ Order creation failed:", orderResult.message);
        toast.error(orderResult.message || "Failed to create payment order");
        setProcessing(false);
        return;
      }

      const { id: order_id, amount, currency } = orderResult.data;
      console.log("✅ Order created:", order_id);

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        console.error("❌ Razorpay SDK not loaded");
        toast.error("Payment gateway not loaded. Please refresh the page.");
        setProcessing(false);
        return;
      }

      // Get Razorpay Key
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      console.log("🔑 Razorpay Key:", razorpayKey);

      if (!razorpayKey || razorpayKey === "rzp_test_your_key_id_here") {
        console.error("❌ Invalid Razorpay Key");
        toast.error("Payment configuration error. Please contact support.");
        setProcessing(false);
        return;
      }

      // Razorpay options
      const options = {
        key: razorpayKey,
        amount: amount,
        currency: currency,
        name: "RKShop",
        description: "Order Payment",
        order_id: order_id,
        handler: async function (response) {
          console.log("✅ Payment response received:", response);
          
          // CRITICAL: Check if all required fields are present
          if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
            console.error("❌ Incomplete payment response:", response);
            toast.error("Payment verification failed - incomplete response");
            setProcessing(false);
            return;
          }

          try {
            console.log("🔐 Verifying payment with backend...");
            
            // Verify payment with backend
            const verifyResponse = await fetch(SummaryApi.verifyPayment.url, {
              method: SummaryApi.verifyPayment.method,
              credentials: "include",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderData: orderData,
              }),
            });

            const verifyResult = await verifyResponse.json();
            console.log("🔐 Verification result:", verifyResult);

            if (verifyResult.success) {
              console.log("✅ Payment verified successfully");
              toast.success("🎉 Payment successful! Order placed.");
              
              // Clear cart
              localStorage.removeItem("checkoutItems");
              localStorage.removeItem("cartItems");
              
              // Update cart count
              if (fetchUserAddToCount) {
                fetchUserAddToCount();
              }

              setTimeout(() => {
                navigate("/");
              }, 1500);
            } else {
              console.error("❌ Payment verification failed:", verifyResult.message);
              toast.error(verifyResult.message || "Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("❌ Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
          city: formData.city,
        },
        theme: {
          color: "#EF4444",
        },
        modal: {
          ondismiss: function () {
            console.log("⚠️ Payment cancelled by user");
            toast.info("Payment cancelled");
            setProcessing(false);
          },
          confirm_close: true, // Ask user before closing
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
      };

      console.log("🚀 Opening Razorpay checkout...");
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', function (response) {
        console.error("❌ Payment failed:", response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setProcessing(false);
      });

      razorpay.open();
    } catch (error) {
      console.error("❌ Razorpay error:", error);
      toast.error("Payment failed. Please try again.");
      setProcessing(false);
    }
  };

  // ✅ Handle COD Order
  const handleCODOrder = async (orderData) => {
    try {
      const response = await fetch(SummaryApi.createCODOrder.url, {
        method: SummaryApi.createCODOrder.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("🎉 Order placed successfully with COD!");
        localStorage.removeItem("checkoutItems");
        localStorage.removeItem("cartItems");
        
        // Update cart count
        if (fetchUserAddToCount) {
          fetchUserAddToCount();
        }

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        toast.error(result.message || "Failed to place order");
      }
    } catch (error) {
      console.error("COD order error:", error);
      toast.error("Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  // ✅ Handle Checkout
  const handlePlaceOrder = async (e) => {
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

    if (checkoutItems.length === 0) {
      toast.error("No items in cart");
      return;
    }

    setProcessing(true);

    // Prepare order data
    const orderData = {
      products: checkoutItems.map((item) => ({
        productId: item._id,
        quantity: item.quantity || 1,
        price: item.selling,
      })),
      shippingAddress: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
      subtotal: subtotal,
      tax: Math.round(subtotal * 0.05),
      total: total,
    };

    // Handle payment based on method
    if (formData.paymentMethod === "COD") {
      await handleCODOrder(orderData);
    } else {
      // Online payment (UPI, Card, etc.)
      await handleRazorpayPayment(orderData);
    }
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
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleChange}
                    className="accent-red-500 w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Cash on Delivery (COD)</p>
                    <p className="text-xs text-gray-500">Pay when you receive the product</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ONLINE"
                    checked={formData.paymentMethod === "ONLINE"}
                    onChange={handleChange}
                    className="accent-red-500 w-4 h-4"
                  />
                  <div>
                    <p className="font-medium">Online Payment (Razorpay)</p>
                    <p className="text-xs text-gray-500">UPI, Cards, Net Banking, Wallets</p>
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing}
              className={`w-full mt-6 py-3 rounded-lg font-semibold text-base shadow-md transition-all ${
                processing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <>
                  {formData.paymentMethod === "COD"
                    ? "Place Order (COD) →"
                    : "Proceed to Payment →"}
                </>
              )}
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
