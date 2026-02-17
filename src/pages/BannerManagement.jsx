import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import SummaryApi from "../../common";
import { Plus, Edit2, Trash2, X, Check, Image as ImageIcon, Upload } from "lucide-react";
import uploadImage from "../PhotoHelper/uploadImage";

const BannerManagement = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingMobileImage, setUploadingMobileImage] = useState(false);
  const [currentBanner, setCurrentBanner] = useState({
    _id: "",
    title: "",
    description: "",
    image: "",
    mobileImage: "",
    link: "",
    order: 0,
    isActive: true,
  });

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.getAllBanners.url, {
        method: SummaryApi.getAllBanners.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setBanners(data.data);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Open modal for add/edit
  const openModal = (banner = null) => {
    if (banner) {
      setEditMode(true);
      setCurrentBanner(banner);
    } else {
      setEditMode(false);
      setCurrentBanner({
        _id: "",
        title: "",
        description: "",
        image: "",
        mobileImage: "",
        link: "",
        order: banners.length,
        isActive: true,
      });
    }
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentBanner({
      _id: "",
      title: "",
      description: "",
      image: "",
      mobileImage: "",
      link: "",
      order: 0,
      isActive: true,
    });
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentBanner((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle desktop image upload
  const handleDesktopImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    try {
      setUploadingImage(true);
      toast.info("Optimizing and uploading desktop image...");
      
      // Upload with 'banner-desktop' type for optimization
      const imageUrl = await uploadImage(file, 'banner-desktop');
      
      if (imageUrl) {
        setCurrentBanner((prev) => ({
          ...prev,
          image: imageUrl,
        }));
        toast.success("Desktop image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle mobile image upload
  const handleMobileImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 10MB before compression)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    try {
      setUploadingMobileImage(true);
      toast.info("Optimizing and uploading mobile image...");
      
      // Upload with 'banner-mobile' type for optimization
      const imageUrl = await uploadImage(file, 'banner-mobile');
      
      if (imageUrl) {
        setCurrentBanner((prev) => ({
          ...prev,
          mobileImage: imageUrl,
        }));
        toast.success("Mobile image uploaded successfully!");
      } else {
        toast.error("Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingMobileImage(false);
    }
  };

  // Save banner
  const handleSave = async (e) => {
    e.preventDefault();

    if (!currentBanner.title.trim() || !currentBanner.image.trim()) {
      toast.error("Title and image are required");
      return;
    }

    try {
      const url = editMode
        ? SummaryApi.updateBanner.url
        : SummaryApi.createBanner.url;
      const method = editMode
        ? SummaryApi.updateBanner.method
        : SummaryApi.createBanner.method;

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(currentBanner),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(
          editMode
            ? "Banner updated successfully!"
            : "Banner created successfully!"
        );
        fetchBanners();
        closeModal();
      } else {
        toast.error(data.message || "Failed to save banner");
      }
    } catch (error) {
      console.error("Error saving banner:", error);
      toast.error("Failed to save banner");
    }
  };

  // Delete banner
  const handleDelete = async (bannerId) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) {
      return;
    }

    try {
      const response = await fetch(SummaryApi.deleteBanner.url, {
        method: SummaryApi.deleteBanner.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ _id: bannerId }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Banner deleted successfully!");
        fetchBanners();
      } else {
        toast.error(data.message || "Failed to delete banner");
      }
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  // Toggle active status
  const toggleActive = async (banner) => {
    try {
      const response = await fetch(SummaryApi.updateBanner.url, {
        method: SummaryApi.updateBanner.method,
        credentials: "include",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          _id: banner._id,
          isActive: !banner.isActive,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Banner status updated!");
        fetchBanners();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Banner Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage homepage banners</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <>
          {/* Banners List */}
          <div className="space-y-4">
            {banners.map((banner, index) => (
              <div
                key={banner._id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Banner Image */}
                  <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {banner.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Order: {banner.order}
                        </p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          banner.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {banner.isActive ? "Active" : "Inactive"}
                      </div>
                    </div>

                    {banner.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {banner.description}
                      </p>
                    )}

                    {banner.link && (
                      <a
                        href={banner.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        {banner.link}
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => toggleActive(banner)}
                      className="flex-1 md:flex-none px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm"
                      title={banner.isActive ? "Deactivate" : "Activate"}
                    >
                      {banner.isActive ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => openModal(banner)}
                      className="flex-1 md:flex-none px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Edit2 className="w-4 h-4 mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDelete(banner._id)}
                      className="flex-1 md:flex-none px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4 mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {banners.length === 0 && (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No banners found</p>
              <button
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Your First Banner
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">
                {editMode ? "Edit Banner" : "Add New Banner"}
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
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentBanner.title}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="e.g., Summer Sale 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={currentBanner.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none resize-none"
                  placeholder="Brief description of the banner"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Desktop Image *
                </label>
                
                {/* Image Upload Button */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-gray-50 hover:bg-red-50">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {uploadingImage ? "Uploading..." : "Upload Desktop Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDesktopImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>

                  {/* Or enter URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">or enter URL</span>
                    </div>
                  </div>

                  <input
                    type="url"
                    name="image"
                    value={currentBanner.image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>

                {/* Image Preview */}
                {currentBanner.image && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <img
                      src={currentBanner.image}
                      alt="Desktop Preview"
                      className="w-full h-40 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 1920x460px (Desktop)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Image (Optional)
                </label>
                
                {/* Mobile Image Upload Button */}
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-500 cursor-pointer transition-colors bg-gray-50 hover:bg-red-50">
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {uploadingMobileImage ? "Uploading..." : "Upload Mobile Image"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMobileImageUpload}
                      disabled={uploadingMobileImage}
                      className="hidden"
                    />
                  </label>

                  {/* Or enter URL */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="px-2 bg-white text-gray-500">or enter URL</span>
                    </div>
                  </div>

                  <input
                    type="url"
                    name="mobileImage"
                    value={currentBanner.mobileImage}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                    placeholder="https://example.com/banner-mobile.jpg"
                  />
                </div>

                {/* Mobile Image Preview */}
                {currentBanner.mobileImage && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <img
                      src={currentBanner.mobileImage}
                      alt="Mobile Preview"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Recommended: 768x320px (Mobile) - If not provided, desktop image will be used
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link URL (Optional)
                </label>
                <input
                  type="url"
                  name="link"
                  value={currentBanner.link}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="https://example.com/sale"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Order
                </label>
                <input
                  type="number"
                  name="order"
                  value={currentBanner.order}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower numbers appear first
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={currentBanner.isActive}
                  onChange={handleChange}
                  className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                />
                <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                  Active (Show on homepage)
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
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
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

export default BannerManagement;
