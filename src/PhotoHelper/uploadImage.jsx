const cloudinary_url = `https://api.cloudinary.com/v1_1/dwhr8xzku/image/upload`;

const uploadImage = async (image) => {
  try {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "E commerse Image");

    const res = await fetch(cloudinary_url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.secure_url) {
      console.log("✅ Image uploaded successfully:", data.secure_url);
      return data.secure_url;
    } else {
      console.error(" Cloudinary upload error:", data);
      return null;
    }
  } catch (error) {
    console.error(" Upload error:", error);
    return null;
  }
};

export default uploadImage;
