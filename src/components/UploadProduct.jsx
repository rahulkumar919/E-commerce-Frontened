import React, { useState } from "react";
import { GiCancel } from "react-icons/gi";
import { FaCloudDownloadAlt } from "react-icons/fa";
import productCategory from "../PhotoHelper/AllProductList";
import uploadImage from "../PhotoHelper/uploadImage";
import DisplayImage from "./DisplayImage";
import { MdDelete } from "react-icons/md";
import summaryApi from "../../common";
import {toast} from "react-toastify"

const UploadProduct = ({ onClose }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    price: "",
    selling: "",
    description : ""
  });

  const [openImage, setOpenImage] = useState(false);
  const [fullScreen, setFullScreen] = useState("");

  const handleDeleteButton =async(index)=>{
     console.log("image index" ,index) ;
     const newProductimage = [...data.productImage] 
     newProductimage.splice(index, 1) ;
     setData((prev)=>{
      return {
        ...prev , 
        productImage  : [...newProductimage]
      }

     })
  }



  // Handle form input changes
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleALLImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;


     
    // Uploded  Product handler function 

    
    

    const uploadedImageUrl = await uploadImage(file);

    if (uploadedImageUrl) {
      setData((prev) => ({
        ...prev,
        productImage: [...prev.productImage, uploadedImageUrl],
      }));

      console.log("✅ Uploaded image:", uploadedImageUrl);
    } else {
      console.error("Image upload failed");
    }
  };

  const handleUploadeProduct = async (e) => {
  e.preventDefault();
  console.log("data", data);

  try {
    const fetchData = await fetch(summaryApi.ProductData.url, {
      method: summaryApi.ProductData.method || "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const ResponseData = await fetchData.json();

    if (ResponseData.success) {
      toast.success(ResponseData?.message);
      onClose();
    } 
    
    if (ResponseData.error) {
      toast.error(ResponseData.error);
    }

    console.log("Product Data Response ", ResponseData);
  } catch (error) {
    console.error("❌ Upload Error:", error);
    toast.error("Failed to upload product. Please try again.");
  }
};

  return (
    // Overlay background
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
      {/* Modal Card with scrollable form */}

      <div className="relative bg-white rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/*  Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
          title="Close"
          onClick={onClose}
        >
          <GiCancel size={22} />
        </button>

        {/* Header */}
        <form className="grid p-4 gap-3 overflow-y-scroll h-full pb-5" onSubmit={handleUploadeProduct}>
            <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Upload Product
          </h2>
          <p className="text-gray-500 text-sm">
            Fill in the details below to add a new product.
          </p>
        </div>

        {/* Upload Form */}
        <div className="mt-6 gap-2 grid">
          {/* Product Name */}
          <label htmlFor="productName" className="font-bold">
            Product Name:
          </label>
          <input
            type="text"
            name="productName"
            id="productName"
            placeholder="Enter Product Name"
            value={data.productName}
            onChange={handleOnchange}
            className="border border-gray-300 rounded w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100"
            required
          />

          {/* Brand Name */}
          <label htmlFor="brandName" className="font-bold">
            Brand Name:
          </label>
          <input
             required
            type="text"
            name="brandName"
            id="brandName"
            placeholder="Enter Brand Name"
            value={data.brandName}
            onChange={handleOnchange}
            className="border border-gray-300 rounded w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100"
          />

          {/* Category */}
          <label htmlFor="category" className="font-bold">
            Category:
          </label>
          <select
              required
            name="category"
            id="category"
            value={data.category}
            onChange={handleOnchange}
            className="border border-gray-300 rounded p-2 bg-slate-100 mb-3"
          >
            <option value="">-- Select Category --</option>
            {productCategory.map((el, index) => (
              <option key={index} value={el.value}>
                {el.label}
              </option>
            ))}
          </select>

          {/* Image Upload Section */}
          <label htmlFor="productImage" className="font-bold mt-3">
            Product Image:
          </label>

          <div className="p-3 bg-white border rounded w-full flex flex-col items-center justify-center gap-3 mb-3">
            {/* Upload button */}
            <label
              htmlFor="productImage"
              className="flex flex-col items-center justify-center cursor-pointer text-gray-600 hover:text-blue-600 "
            >
              <FaCloudDownloadAlt size={40} />
              <span className="font-semibold ">Upload Image</span>
              <input
                type="file"
                id="productImage"
                className="hidden "
                accept="image/*"
                onChange={handleALLImage}
              />
            </label>

            {/* Uploaded image preview */}
            <div className="flex gap-3 flex-wrap justify-center mt-2 cursor-pointer">
              {data.productImage && data.productImage.length > 0 ? (
                data.productImage.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt="Uploaded"
                      className="w-20 h-20 object-cover rounded border shadow-sm "
                      onClick={() => {
                        setOpenImage(true);
                        setFullScreen(url);
                      }}
                    />
                    <div className="absolute botton-0 p-1 text-white bg-red-500 hidden  group-hover:block cursor-pointer right-0 " onClick={
                      ()=>handleDeleteButton(index)
                    }>
                     < MdDelete />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-red-500 text-sm">No image uploaded yet</p>
              )}
            </div>
          </div>

          {/* Price section */}
          <div>
            <label htmlFor="price" className="font-bold">
              Price:
            </label>
            <input
                required
              type="number"
              placeholder="Enter the Price"
              value={data.price}
              name="price"
              id="price"
              className="border rounded w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100"
              onChange={handleOnchange}
            />
          </div>

          {/* Selling Price */}
          <div>
            <label htmlFor="selling" className="font-bold">
              Selling Price:
            </label>
            <input
                required
              type="number"
              placeholder="Enter the Selling Price"
              value={data.selling}
              name="selling"
              id="selling"
              className="border rounded w-full p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100"
              onChange={handleOnchange}
            />
          </div>

           {/* // discription section  */}
           <label htmlFor="description" className="mt-3"> Description :</label>
           <textarea name="description" id="description"  value={data.description} className="h-32 bg-slate-100 border resize-none" placeholder="Enter the Product Discription "  roes={5}cols={7} onChange={handleOnchange} >

           </textarea>


          {/* Submit Button */}
          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mt-4" >
            Upload Product
          </button>


       {openImage && (
      <DisplayImage
        imgUrl={fullScreen}
        onClose={() => setOpenImage(false)}
      />
    )}
    </div>

        </form>
        
        </div>
      </div>
   
  );


  // Full screen Imgage section Gone

  
  

};

export default UploadProduct;
