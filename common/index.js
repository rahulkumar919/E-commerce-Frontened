import { Meh } from "lucide-react";

const backenDomain = "http://localhost:8080";
const baseUrl = "http://localhost:8080/api";

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
  searchProduct: {
    url: `${backenDomain}/api/search`,
    method: "GET",
  },
  getProductByid: {
    url: `${backenDomain}/api/product-details`,
    method: "get",
  },
};

export default summaryApi;
