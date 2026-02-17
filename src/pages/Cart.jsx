import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../App";
import SummaryApi from "../../common";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, fetchUserAddToCount } = useContext(Context);

  // Check if user is logged in
  useEffect(() => {
    if (!user) {
      toast.warning("Please login to view your cart");
      navigate("/login");
    } else {
      fetchCartItems();
    }
  }, [user, navigate]);

  // Fetch cart items from backend
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getCartProducts.url, {
        method: SummaryApi.getCartProducts.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setCartItems(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch cart items");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  //  Increase / Decrease quantity
  const updateQuantity = async (cartItemId, delta, currentQty) => {
    const newQty = Math.max(1, currentQty + delta);
    
    try {
      const response = await fetch(SummaryApi.updateCartProduct.url, {
        method: SummaryApi.updateCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: cartItemId,
          quantity: newQty,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local state
        setCartItems((prev) =>
          prev.map((item) =>
            item._id === cartItemId ? { ...item, quantity: newQty } : item
          )
        );
        // Update cart count
        if (fetchUserAddToCount) {
          fetchUserAddToCount();
        }
      } else {
        toast.error(data.message || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  //  Remove item
  const removeItem = async (cartItemId) => {
    try {
      const response = await fetch(SummaryApi.deleteCartProduct.url, {
        method: SummaryApi.deleteCartProduct.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ _id: cartItemId }),
      });

      const data = await response.json();

      if (data.success) {
        setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
        toast.success("Item removed from cart 🗑️");
        // Update cart count
        if (fetchUserAddToCount) {
          fetchUserAddToCount();
        }
      } else {
        toast.error(data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  //  Subtotal calculation
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.productId?.selling || 0) * item.quantity,
    0
  );

  //  Redirect on Buy Now
  const handleBuyNow = (item) => {
    if (!user) {
      toast.warning("Please login to proceed with purchase");
      navigate("/login");
      return;
    }
    localStorage.setItem("checkoutItem", JSON.stringify(item.productId));
    toast.success(`Proceeding to checkout for ${item.productId?.productName} 🛒`);
    navigate("/checkout");
  };

  //  Redirect on Cart Checkout
  const handleCheckout = () => {
    if (!user) {
      toast.warning("Please login to proceed with checkout");
      navigate("/login");
      return;
    }
    if (cartItems.length === 0) {
      toast.info("Your cart is empty!");
      return;
    }
    // Store product details for checkout
    const checkoutData = cartItems.map(item => ({
      ...item.productId,
      quantity: item.quantity
    }));
    localStorage.setItem("checkoutItems", JSON.stringify(checkoutData));
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
              {loading ? (
                <div className="text-center py-10">
                  <p className="text-gray-600">Loading cart...</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all bg-white"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4 w-full sm:w-2/3">
                      <img
                        src={item?.productId?.productImage?.[0]}
                        alt={item?.productId?.productName}
                        className="w-24 h-24 sm:w-28 sm:h-28 object-contain bg-gray-50 rounded-lg border"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item?.productId?.productName}
                        </h3>
                        <p className="text-sm text-gray-500 capitalize">
                          {item?.productId?.brandName}
                        </p>

                        {/* Price & Discount */}
                        <div className="flex items-center gap-3 mt-2">
                          <p className="text-red-500 font-bold text-lg">
                            ₹{item?.productId?.selling}
                          </p>
                          <p className="text-gray-400 line-through text-sm">
                            ₹{item?.productId?.price}
                          </p>
                          <span className="text-green-600 font-semibold text-sm">
                            {Math.round(
                              ((item?.productId?.price - item?.productId?.selling) / item?.productId?.price) * 100
                            )}
                            % off
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item._id, -1, item.quantity)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-bold"
                      >
                        −
                      </button>
                      <span className="text-lg font-semibold text-gray-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item._id, +1, item.quantity)}
                        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-bold"
                      >
                        +
                      </button>
                    </div>

                    {/* Price & Actions */}
                    <div className="flex flex-col items-center sm:items-end gap-3">
                      <p className="text-lg font-semibold text-gray-800">
                        ₹{(item?.productId?.selling || 0) * item.quantity}
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
                ))
              )}
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
