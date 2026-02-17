import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../common";
import { Plus, Edit2, Trash2, Package, X, Check, Upload, Image as ImageIcon } from "lucide-react";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState({
    _id: "",
    name: "",
    description: "",
    image: "",
    isActive: true,
  });

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getAllCategories.url, {
        method: SummaryApi.getAllCategories.method,
      });

      const data = await response.json();

      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open modal for add/edit
  const openModal = (category = null) => {
    if (category) {
      setEditMode(true);
      setCurrentCategory(category);
    } else {
      setEditMode(false);
      setCurrentCategory({
        _id: "",
        name: "",
        description: "",
        image: "",
        isActive: true,
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentCategory({
      _id: "",
      name: "",
      description: "",
      image: "",
      isActive: true,
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentCategory((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 15MB)
    if (file.size > 15 * 1024 * 1024) {
      toast.error("Image size should be less than 15MB");
      return;
    }

    try {
      setUploading(true);

      const cloudName = import.meta.env.VITE_CLOUD_NAME || import.meta.env.REACT_APP_CLOUD_NAME;
      
      if (!cloudName) {
        toast.error("Cloudinary configuration missing. Please add VITE_CLOUD_NAME to .env file");
        setUploading(false);
        return;
      }

      console.log("🔄 Uploading to Cloudinary:", cloudName);

      // Try multiple upload presets in order
      const presetsToTry = ["E commerse Image", "mern_product", "ml_default"];
      let uploadSuccess = false;
      let uploadedUrl = null;

      for (let i = 0; i < presetsToTry.length; i++) {
        const preset = presetsToTry[i];
        console.log(`Trying preset: ${preset}`);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", preset);

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );

          const data = await response.json();

          if (data.secure_url) {
            uploadedUrl = data.secure_url;
            uploadSuccess = true;
            console.log(`✅ Upload successful with preset: ${preset}`);
            break;
          } else if (data.error) {
            console.log(`❌ Preset ${preset} failed:`, data.error.message);
            if (i === presetsToTry.length - 1) {
              // Last attempt failed
              throw new Error(data.error.message);
            }
          }
        } catch (err) {
          console.log(`❌ Error with preset ${preset}:`, err.message);
          if (i === presetsToTry.length - 1) {
            throw err;
          }
        }
      }

      if (uploadSuccess && uploadedUrl) {
        setCurrentCategory((prev) => ({ ...prev, image: uploadedUrl }));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("All upload presets failed");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error(
        "Failed to upload image. Please create an unsigned upload preset in Cloudinary. " +
        "Go to Settings → Upload → Add upload preset → Name: 'mern_product' → Signing mode: 'Unsigned' → Save"
      );
    } finally {
      setUploading(false);
    }
  };

  // Save category
  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      const url = editMode
        ? SummaryApi.updateCategory.url
        : SummaryApi.createCategory.url;
      const method = editMode
        ? SummaryApi.updateCategory.method
        : SummaryApi.createCategory.method;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(currentCategory),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editMode
            ? "Category updated successfully!"
            : "Category created successfully!"
        );
        fetchCategories();
        closeModal();
      } else {
        toast.error(data.message || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      toast.error("Failed to save category");
    }
  };

  // Delete category
  const handleDelete = async (categoryId, categoryName, productCount) => {
    if (productCount > 0) {
      toast.error(`Cannot delete "${categoryName}". ${productCount} products are using this category.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete "${categoryName}"?`)) {
      return;
    }

    try {
      const response = await fetch(SummaryApi.deleteCategory.url, {
        method: SummaryApi.deleteCategory.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ _id: categoryId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Category deleted successfully!");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed to delete category");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Category Management</h2>
          <p className="text-sm text-gray-600 mt-1">
            Manage product categories with images and product counts
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <>
          {/* Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <div
                key={category._id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
              >
                {/* Category Image */}
                <div className="w-full h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/200x200?text=No+Image";
                      }}
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-gray-300" />
                  )}
                </div>

                {/* Category Info */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                      {category.name}
                    </h3>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium ml-2 ${
                        category.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {category.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>

                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 pb-3 border-b">
                    <Package className="w-4 h-4" />
                    <span className="font-medium">{category.productCount || 0} Products</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(category)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id, category.name, category.productCount)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                      disabled={category.productCount > 0}
                      title={category.productCount > 0 ? "Cannot delete category with products" : "Delete category"}
                    >
                      <Trash2 className="w-3 h-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {categories.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No categories found</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Category
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editMode ? "Edit Category" : "Add New Category"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentCategory.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="e.g., Electronics, Fashion, Home"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentCategory.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of the category"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Image
                </label>

                {/* Image Preview */}
                {currentCategory.image && (
                  <div className="mb-3 relative">
                    <img
                      src={currentCategory.image}
                      alt="Category preview"
                      className="w-full h-40 object-contain bg-gray-50 rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentCategory({ ...currentCategory, image: "" })}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <label
                  className={`flex items-center justify-center gap-3 w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                    uploading
                      ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                      : "border-red-300 hover:border-red-500 hover:bg-red-50"
                  }`}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                      <span className="text-gray-600">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 text-red-600" />
                      <span className="text-gray-700 font-medium">
                        {currentCategory.image ? "Change Image" : "Upload Image"}
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: Square image (500x500px), Max size: 15MB
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={currentCategory.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active Category (Show on website)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`flex-1 flex items-center justify-center gap-2 rounded-lg transition-colors ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  } text-white px-4 py-2`}
                >
                  <Check className="w-4 h-4" />
                  {editMode ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
