import React, { useState, useEffect } from "react";
import { FaBoxOpen, FaEdit, FaTrashAlt } from "react-icons/fa";
import UploadProduct from "../components/UploadProduct";
import summaryApi from "../../common";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const AllProduct = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  //  Fetch All Products
  const fetchAllProducts = async () => {
    try {
      
      const response = await fetch(summaryApi.GetProduct.url);
      const dataResponse = await response.json();

      if (dataResponse.success) {
        setAllProducts(dataResponse.data || []);
      } else {
        console.error("Error fetching products:", dataResponse.message);
      }
    } catch (error) {
      console.error(" Failed to fetch products:", error);
    } finally {
     
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="p-3 bg-blue-100 text-blue-600 rounded-full shadow-inner"
          >
            <FaBoxOpen size={22} />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-gray-800 tracking-wide">
            All Products
          </h2>
        </div>

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
      ) : allProducts.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-500 text-center mt-16 text-lg"
        >
          No products found 😔
        </motion.p>
      ) : (
        <motion.div
          layout
          className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence>
            {allProducts.map((product, index) => (
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
