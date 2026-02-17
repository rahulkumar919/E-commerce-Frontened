/**
 * Image Optimizer Utility
 * Handles image compression and resizing for optimal web performance
 */

/**
 * Compress and resize image for web
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} - Compressed image file
 */
const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.85,
    outputFormat = 'image/jpeg'
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: outputFormat,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          outputFormat,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Image loading failed'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('File reading failed'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Create optimized versions for different screen sizes
 * @param {File} file - Original image file
 * @returns {Promise<Object>} - Object with desktop and mobile versions
 */
export const createResponsiveImages = async (file) => {
  try {
    // Desktop version (1920x460 for banners)
    const desktopImage = await compressImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      outputFormat: 'image/jpeg'
    });
    
    // Mobile version (768x320 for banners)
    const mobileImage = await compressImage(file, {
      maxWidth: 768,
      maxHeight: 768,
      quality: 0.80,
      outputFormat: 'image/jpeg'
    });
    
    return {
      desktop: desktopImage,
      mobile: mobileImage,
      original: file
    };
  } catch (error) {
    console.error('Image optimization error:', error);
    throw error;
  }
};

/**
 * Optimize product images
 * @param {File} file - Product image file
 * @returns {Promise<File>} - Optimized image
 */
export const optimizeProductImage = async (file) => {
  return compressImage(file, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 0.85,
    outputFormat: 'image/jpeg'
  });
};

/**
 * Optimize banner image for desktop
 * @param {File} file - Banner image file
 * @returns {Promise<File>} - Optimized desktop banner
 */
export const optimizeBannerDesktop = async (file) => {
  return compressImage(file, {
    maxWidth: 1920,
    maxHeight: 600,
    quality: 0.90,
    outputFormat: 'image/jpeg'
  });
};

/**
 * Optimize banner image for mobile
 * @param {File} file - Banner image file
 * @returns {Promise<File>} - Optimized mobile banner
 */
export const optimizeBannerMobile = async (file) => {
  return compressImage(file, {
    maxWidth: 768,
    maxHeight: 400,
    quality: 0.85,
    outputFormat: 'image/jpeg'
  });
};

/**
 * Get image dimensions
 * @param {File} file - Image file
 * @returns {Promise<Object>} - Width and height
 */
export const getImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target.result;
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} - Validation result
 */
export const validateImage = async (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    minWidth = 0,
    minHeight = 0,
    maxWidth = Infinity,
    maxHeight = Infinity
  } = options;

  const errors = [];

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    errors.push(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`);
  }

  // Check file size
  if (file.size > maxSize) {
    errors.push(`File too large. Max size: ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
  }

  // Check dimensions
  try {
    const dimensions = await getImageDimensions(file);
    
    if (dimensions.width < minWidth) {
      errors.push(`Image width too small. Minimum: ${minWidth}px`);
    }
    
    if (dimensions.height < minHeight) {
      errors.push(`Image height too small. Minimum: ${minHeight}px`);
    }
    
    if (dimensions.width > maxWidth) {
      errors.push(`Image width too large. Maximum: ${maxWidth}px`);
    }
    
    if (dimensions.height > maxHeight) {
      errors.push(`Image height too large. Maximum: ${maxHeight}px`);
    }
  } catch (error) {
    errors.push('Failed to read image dimensions');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export default compressImage;
