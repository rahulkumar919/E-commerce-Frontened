import { optimizeBannerDesktop, optimizeBannerMobile, optimizeProductImage } from './imageOptimizer';

const cloudinary_url = `https://api.cloudinary.com/v1_1/dwhr8xzku/image/upload`;

/**
 * Upload image to Cloudinary
 * @param {File} image - Image file to upload
 * @param {string} type - Type of image ('banner-desktop', 'banner-mobile', 'product')
 * @returns {Promise<string|null>} - Uploaded image URL or null
 */
const uploadImage = async (image, type = 'product') => {
  try {
    let optimizedImage = image;

    // Optimize image based on type
    try {
      if (type === 'banner-desktop') {
        optimizedImage = await optimizeBannerDesktop(image);
        console.log('✅ Desktop banner optimized');
      } else if (type === 'banner-mobile') {
        optimizedImage = await optimizeBannerMobile(image);
        console.log('✅ Mobile banner optimized');
      } else if (type === 'product') {
        optimizedImage = await optimizeProductImage(image);
        console.log('✅ Product image optimized');
      }
    } catch (optimizeError) {
      console.warn('⚠️ Image optimization failed, uploading original:', optimizeError);
      optimizedImage = image;
    }

    const formData = new FormData();
    formData.append("file", optimizedImage);
    formData.append("upload_preset", "E commerse Image");

    const res = await fetch(cloudinary_url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    // If preset not found, try with fallback preset
    if (data.error && data.error.message && data.error.message.includes("preset")) {
      console.log("⚠️ Upload preset 'E commerse Image' not found, trying fallback 'mern_product'...");
      
      const formData2 = new FormData();
      formData2.append("file", optimizedImage);
      formData2.append("upload_preset", "mern_product");

      const res2 = await fetch(cloudinary_url, {
        method: "POST",
        body: formData2,
      });

      const data2 = await res2.json();

      if (data2.secure_url) {
        console.log("✅ Image uploaded successfully with fallback preset:", data2.secure_url);
        return data2.secure_url;
      } else {
        console.error("❌ Cloudinary upload error with fallback:", data2);
        return null;
      }
    }

    if (data.secure_url) {
      console.log("✅ Image uploaded successfully:", data.secure_url);
      return data.secure_url;
    } else {
      console.error("❌ Cloudinary upload error:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Upload error:", error);
    return null;
  }
};

export default uploadImage;
