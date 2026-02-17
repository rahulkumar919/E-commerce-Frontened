import App from "../App.jsx";
import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import ForgetPassword from "../pages/ForgetPassword.jsx";
import SignUP from "../pages/SignUP.jsx";
import AdminPannel from "../pages/AdminPannel.jsx";
import AllUser from "../pages/AllUser.jsx";
import Allproduct from "../pages/Allproduct.jsx";
import VerifyOtp from "../pages/VerifyOtp.jsx";
import CategoryProduct from "../components/CategoryProduct.jsx";
import ProductDetails from "../components/ProductDetails.jsx";
import Cart from "../pages/Cart.jsx";
import Checkout from "../PhotoHelper/Checkout.jsx";
import SearchProduct from "../components/SearchProduct.jsx";
import SiteSettings from "../pages/SiteSettings.jsx";
import CategoryManagement from "../pages/CategoryManagement.jsx";
import BannerManagement from "../pages/BannerManagement.jsx";
import AllCategoriesPage from "../pages/AllCategoriesPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "sign-up", element: <SignUP /> },
      { path: "all-categories", element: <AllCategoriesPage /> },
      { path: "product-category", element: <CategoryProduct /> },
      { path: "product-category/:category", element: <CategoryProduct /> },
      { path: "product-details/:id", element: <ProductDetails /> },
      { path: "checkout", element: <Checkout /> },
      { path: "cart", element: <Cart /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      { path: "search", element: <SearchProduct /> },

      //  Admin panel routes (separate)
      {
        path: "admin-pannel",
        element: <AdminPannel />,
        children: [
          { path: "users", element: <AllUser /> },
          { path: "products", element: <Allproduct /> },
          { path: "categories", element: <CategoryManagement /> },
          { path: "banners", element: <BannerManagement /> },
          { path: "site-settings", element: <SiteSettings /> },
        ],
      },
    ],
  },
]);

export default router;
