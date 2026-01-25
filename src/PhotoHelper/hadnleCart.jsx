// ✅ Add to Cart Handler (can be used anywhere)
const handleAddToCart = (product) => {
  // Get cart from localStorage
  const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

  // Check if product already exists in cart
  const existingItemIndex = existingCart.findIndex(
    (item) => item._id === product._id
  );

  if (existingItemIndex !== -1) {
    // ✅ If already exists, increase quantity by 1
    existingCart[existingItemIndex].quantity += 1;
    toast.info(`${product.productName} quantity increased 🛒`);
  } else {
    // ✅ If new product, add it with quantity 1
    existingCart.push({ ...product, quantity: 1 });
    toast.success(`${product.productName} added to cart 🛍️`);
  }

  // Save updated cart
  localStorage.setItem("cartItems", JSON.stringify(existingCart));
};


export default handleAddToCart