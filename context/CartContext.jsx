import React, { createContext, useEffect, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  // Load cart from localStorage on startup
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setCartCount(totalQuantity);
  }, []);

  // Update count whenever cart changes
  const updateCartCount = () => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    );
    setCartCount(totalQuantity);
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

