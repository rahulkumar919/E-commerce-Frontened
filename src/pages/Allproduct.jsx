import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaEdit, FaTrashAlt, FaFilter } from "react-icons/fa";
import UploadProduct from "../components/UploadProduct";
import summaryApi from "../../common";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const AllProduct = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [productCounts, setProductCounts] = useState({});
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  //  Fetch All Products
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(summaryApi.GetProduct.url);
      const dataResponse = await response.json();

      if (dataResponse.success) {
        const products = dataResponse.data || [];
        setAllProducts(products);
        setFilteredProducts(products);
        
        // Calculate product counts per category
        const counts = {};
        products.forEach(product => {
          const category = product.category || 'uncategorized';
          counts[category] = (counts[category] || 0) + 1;
        });
        setProductCounts(counts);
        
      } else {
        console.error("Error fetching products:", dataResponse.message);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  //  Fetch Categories
  const fetchCategories = async () => {
    try {
      const response = await fetch(summaryApi.getAllCategories.url);
      const dataResponse = await response.json();

      if (dataResponse.success) {
        // Map categories to have value and label properties
        const mappedCategories = (dataResponse.data || []).map(cat => ({
          _id: cat._id,
          value: cat.name,
          label: cat.name,
          productCount: cat.productCount || 0
        }));
        setCategories(mappedCategories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchAllProducts();
    fetchCategories();
  }, []);

  //  Filter products by category
  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredProducts(allProducts);
    } else {
      // Case-insensitive category matching
      const filtered = allProducts.filter(
        product => product.category && product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [selectedCategory, allProducts]);

  //  Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // Show message with product count
    if (category === "all") {
      toast.info(`Showing all ${allProducts.length} products`);
    } else {
      const count = productCounts[category] || 0;
      const categoryName = categories.find(cat => cat.value === category)?.label || category;
      toast.info(`${categoryName}: ${count} product${count !== 1 ? 's' : ''} found`);
    }
  };

  // Reset to all products
  const resetFilter = () => {
    setSelectedCategory("all");
    setShowCategoryFilter(false);
    toast.info(`Showing all ${allProducts.length} products`);
  };

  //  Open Edit Modal
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setOpenUploadProduct(true);
  };

  //  Delete Product
  const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        summaryApi.DeleteProduct.url.replace(":id", productId),
        {
          method: summaryApi.DeleteProduct.method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Product deleted successfully!");
        setAllProducts((prev) => prev.filter((p) => p._id !== productId)); // remove from UI instantly
      } else {
        toast.error(result.message || "Failed to delete product!");
      }
    } catch (error) {
      console.error(" Delete error:", error);
      toast.error("Something went wrong while deleting!");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* 🏷️ Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="p-3 bg-blue-100 text-blue-600 rounded-full shadow-inner"
          >
            <FaBoxOpen size={22} />
          </motion.div>
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
              All Products
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedCategory === "all" 
                ? `Total: ${allProducts.length} products` 
                : `${filteredProducts.length} of ${allProducts.length} products`}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Toggle Category Filter Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition-all shadow-md ${
              showCategoryFilter
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400"
            }`}
          >
            <FaFilter size={16} />
            {showCategoryFilter ? "Hide Filter" : "Filter by Category"}
          </motion.button>

          {/* Add Product Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditProduct(null);
              setOpenUploadProduct(true);
            }}
            className="bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-md"
          >
            + Add Product
          </motion.button>
        </div>
      </div>

      {/* 🔍 Category Filter Section - Only show when toggled */}
      {showCategoryFilter && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 bg-white rounded-xl shadow-sm p-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-800">Select Category</h3>
            </div>
            
            {/* Category Dropdown Select */}
            <div className="w-full sm:w-auto">
              <select
                value={selectedCategory === "all" ? "" : selectedCategory}
                onChange={(e) => {
                  if (e.target.value) {
                    handleCategoryChange(e.target.value);
                  }
                }}
                className="w-full sm:w-64 px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white text-gray-700 font-medium cursor-pointer transition-all hover:border-blue-400"
              >
                {/* Placeholder Option */}
                <option value="" disabled>
                  Choose a category...
                </option>
                
                {/* Individual Category Options - NO "All Categories" */}
                {categories.map((category) => {
                  const count = productCounts[category.value] || 0;
                  return (
                    <option key={category._id} value={category.value}>
                      {category.label} ({count} product{count !== 1 ? 's' : ''})
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Category Info Message */}
          {selectedCategory !== "all" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between"
            >
              <p className="text-sm text-blue-800">
                <span className="font-semibold">
                  {categories.find(cat => cat.value === selectedCategory)?.label || selectedCategory}
                </span>
                {" - "}
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={resetFilter}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium underline"
              >
                Show All Products
              </button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 🧩 Product List Section */}
      {loading ? (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array(8)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg shadow-sm p-4 h-56 flex flex-col justify-center items-center"
              >
                <div className="w-24 h-24 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-lg mb-2">
            {selectedCategory === "all" 
              ? "No products found 😔" 
              : `No products in this category 😔`}
          </p>
          {selectedCategory !== "all" && (
            <button
              onClick={() => handleCategoryChange("all")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all products →
            </button>
          )}
        </motion.div>
      ) : (
        <motion.div
          layout
          className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="relative bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                {/* 🖼️ Product Image */}
                <div className="w-full h-40 overflow-hidden flex items-center justify-center bg-gray-50">
                  <motion.img
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                    src={
                      product?.productImage?.[0] ||
                      "https://via.placeholder.com/300x300?text=No+Image"
                    }
                    alt={product.productName || "Product"}
                    className="w-full h-full object-contain p-3 transition-transform duration-300"
                  />
                </div>

                {/* 📝 Product Info */}

             
                <div className="p-4 text-center">
                  <h2 className="font-semibold  text-gray-700 text-lg  truncate">
                    {product.description}
                  </h2>
                  <h3 className="font-semibold text-gray-800 text-lg truncate">
                    {product.productName}
                  </h3>
                  <p className="text-gray-500 text-sm mb-1 truncate">
                    {product.brandName}
                  </p>
                  <p className="font-semibold text-blue-600 text-base">
                    ₹{product.selling || product.price}
                  </p>
                </div>

                {/* ✏️ Edit Button */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleEditProduct(product)}
                  className="absolute top-3 right-12 bg-yellow-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
                  title="Edit Product"
                >
                  <FaEdit size={15} />
                </motion.button>

                {/*  Delete Button */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteProduct(product._id)}
                  className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md"
                  title="Delete Product"
                >
                  <FaTrashAlt size={15} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* 🧾 Upload / Edit Product Modal */}
      {openUploadProduct && (
        <UploadProduct
          onClose={() => setOpenUploadProduct(false)}
          existingProduct={editProduct}
          onRefresh={fetchAllProducts}
        />
      )}
    </div>
  );
};

export default AllProduct;
