import { Meh } from "lucide-react";

// 🔧 TEMPORARY: Use local backend for testing
// Change back to production URL after backend is deployed to Vercel
const backenDomain = "http://localhost:8080";
// const backenDomain = "https://e-commerce-store-inky-nine.vercel.app"; // Production URL

const baseUrl = `${backenDomain}/api`;

const summaryApi = {
  signup: {
    url: `${backenDomain}/api/signup`,
    method: "post",
  },
  signin: {
    url: `${backenDomain}/api/signin`,
    method: "post",
  },
  current_user: {
    url: `${backenDomain}/api/user-details`,
    method: "get",
  },
  useLogout: {
    url: `${backenDomain}/api/userLogout`,
    method: "get",
  },
  AllUSer: {
    url: `${backenDomain}/api/all-user`,
    method: "get",
  },
  UpdateAlluser: {
    url: `${backenDomain}/api/update-alluser`,
    method: "post",
  },
  ProductData: {
    url: `${backenDomain}/api/uploadProduct`,
    method: "post",
  },
  GetProduct: {
    url: `${backenDomain}/api/get-product`,
    method: "get",
  },
  DeleteProduct: {
    url: `${backenDomain}/api/delete-product/:id`,
    method: "DELETE",
  },
  GetDataCategory: {
    url: `${backenDomain}/api/getCatogeryData`,
    method: "get",
  },

  //  / otp domain 
  SendOtp: { url: `${backenDomain}/api/send-otp`, method: "post" },
  VerifyOtp: { url: `${backenDomain}/api/verify-otp`, method: "post" },
  ResendOtp: { url: `${backenDomain}/api/resend-otp`, method: "post" },

  // Google Auth
  googleAuth: { url: `${backenDomain}/api/google-auth`, method: "post" },

  CategoryWiseProduct: {
    url: `${backenDomain}/api/category-product`,
    method: "post",
  },
  addtoCartProduct: {
    url: `${backenDomain}/api/addtocart`,
    method: "post",
  },
  countToProdcut: {
    url: `${backenDomain}/api/countAddToProduct`,
    method: "get",
  },
  getCartProducts: {
    url: `${backenDomain}/api/cart-products`,
    method: "get",
  },
  updateCartProduct: {
    url: `${backenDomain}/api/update-cart`,
    method: "post",
  },
  deleteCartProduct: {
    url: `${backenDomain}/api/delete-cart`,
    method: "post",
  },
  // Site Settings
  getSiteSettings: {
    url: `${backenDomain}/api/site-settings`,
    method: "get",
  },
  updateSiteSettings: {
    url: `${backenDomain}/api/update-site-settings`,
    method: "post",
  },
  // Categories
  createCategory: {
    url: `${backenDomain}/api/create-category`,
    method: "post",
  },
  getAllCategories: {
    url: `${backenDomain}/api/categories`,
    method: "get",
  },
  updateCategory: {
    url: `${backenDomain}/api/update-category`,
    method: "post",
  },
  deleteCategory: {
    url: `${backenDomain}/api/delete-category`,
    method: "post",
  },
  // Banners
  createBanner: {
    url: `${backenDomain}/api/create-banner`,
    method: "post",
  },
  getAllBanners: {
    url: `${backenDomain}/api/banners`,
    method: "get",
  },
  getActiveBanners: {
    url: `${backenDomain}/api/active-banners`,
    method: "get",
  },
  updateBanner: {
    url: `${backenDomain}/api/update-banner`,
    method: "post",
  },
  deleteBanner: {
    url: `${backenDomain}/api/delete-banner`,
    method: "post",
  },
  searchProduct: {
    url: `${backenDomain}/api/search`,
    method: "GET",
  },
  getProductByid: {
    url: `${backenDomain}/api/product-details`,
    method: "get",
  },
  getRelatedProducts: {
    url: `${backenDomain}/api/related-products`,
    method: "get",
  },
  // Payment
  createOrder: {
    url: `${backenDomain}/api/create-order`,
    method: "post",
  },
  verifyPayment: {
    url: `${backenDomain}/api/verify-payment`,
    method: "post",
  },
  createCODOrder: {
    url: `${backenDomain}/api/create-cod-order`,
    method: "post",
  },
};

export default summaryApi;
