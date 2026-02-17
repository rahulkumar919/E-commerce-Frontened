import { useContext, useState, useEffect } from "react";
import { FaSearch, FaUserAlt, FaCartPlus } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import rkk from "../assets/rkk.jpg";
import summaryApi from "../../common";
import { toast } from "react-toastify";
import { Context } from "../App";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/userSlice";
import ROLE from "../../common/role";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useSiteSettings } from "../context/SiteSettingsContext";

const Header = () => {
  const navigate = useNavigate();
  const { fetchUserDetails, cartProductCount } = useContext(Context);
  const dispatch = useDispatch();
  const { siteSettings } = useSiteSettings();
  
  const { user, setUser } = useContext(Context);

  // States
  const [click, setClick] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showGoogleSignIn, setShowGoogleSignIn] = useState(false);

  // Handle Google Login Success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google User Info:", decoded);

      const response = await fetch(summaryApi.googleAuth.url, {
        method: summaryApi.googleAuth.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: decoded.email,
          name: decoded.name,
          profilePic: decoded.picture,
          googleId: decoded.sub,
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Server returned non-JSON response");
        toast.error("Server error. Please try again later.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        await fetchUserDetails();
        setShowGoogleSignIn(false);
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Google sign-in failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled");
  };

  // Logout
  const handleLogout = async () => {
    try {
      const response = await fetch(summaryApi.useLogout.url, {
        method: summaryApi.useLogout.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Logged out successfully!");
        dispatch(setUserDetails(null));
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message || "Logout failed");
      }
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Something went wrong!");
    }
  };

  // Fetch Search Suggestions
  const fetchSearchResults = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoadingSearch(true);
    try {
      const res = await fetch(
        `${summaryApi.searchProduct.url}?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data.success) {
        setSuggestions(data.data || []);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoadingSearch(false);
    }
  };

  // Debounce Search Input
  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim()) fetchSearchResults(search);
      else setSuggestions([]);
    }, 400);

    return () => clearTimeout(delay);
  }, [search]);

  // Handle Search Submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setSuggestions([]);
    } else {
      toast.info("Please enter a product name!");
    }
  };

  return (
    <header className="h-16 sm:h-20 shadow-md bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto h-full flex items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
        
        {/* Logo Section */}
        <Link
          to="/"
          className="flex items-center gap-2 group flex-shrink-0"
        >
          <img
            src={rkk}
            alt={siteSettings.siteName || "Shop"}
            className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full shadow-sm group-hover:shadow-md transition-shadow"
          />
          <h1 className="hidden sm:block text-lg sm:text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">
            {siteSettings.siteName || "RKShop"}
          </h1>
        </Link>

        {/* Search Box - Desktop & Tablet */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="w-full px-4 py-2.5 pr-12 border-2 border-gray-200 rounded-full outline-none focus:border-red-500 focus:shadow-md transition-all text-sm"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
            >
              <FaSearch className="text-sm" />
            </button>

            {/* Search Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-xl rounded-lg mt-2 z-50 max-h-96 overflow-y-auto">
                {loadingSearch && (
                  <p className="p-3 text-gray-500 text-center text-sm">
                    Searching...
                  </p>
                )}

                {suggestions.map((item) => (
                  <Link
                    to={`/product-details/${item._id}`}
                    key={item._id}
                    onClick={() => {
                      setSearch("");
                      setSuggestions([]);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
                  >
                    <img
                      src={item?.productImage?.[0]}
                      alt={item.productName}
                      className="w-14 h-14 object-contain bg-gray-50 rounded-md border"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">
                        {item.productName}
                      </p>
                      <p className="text-sm text-red-600 font-semibold mt-0.5">
                        ₹{item.selling}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </form>
        </div>

        {/* Search Icon - Mobile Only */}
        <button
          onClick={() => setSearch("")}
          className="md:hidden text-gray-700 hover:text-red-600 transition-colors p-2"
        >
          <FaSearch className="text-xl" />
        </button>

        {/* User Actions Section */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          
          {user?._id ? (
            <>
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setClick((prev) => !prev)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user?.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FaUserAlt className="text-red-600 text-sm" />
                    </div>
                  )}
                  <span className="hidden lg:block text-sm font-medium text-gray-700 max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {click && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setClick(false)}
                    ></div>
                    <div className="absolute top-full right-0 mt-2 bg-white shadow-xl rounded-lg border border-gray-200 w-48 z-40 overflow-hidden">
                      <div className="p-3 border-b bg-gray-50">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <nav className="py-1">
                        {user?.role === ROLE.ADMIN && (
                          <Link
                            to="/admin-pannel"
                            onClick={() => setClick(false)}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                          >
                            Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setClick(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          Logout
                        </button>
                      </nav>
                    </div>
                  </>
                )}
              </div>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FaCartPlus className="text-xl sm:text-2xl text-gray-700" />
                {cartProductCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {cartProductCount}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              {/* Login Button */}
              <Link
                to="/login"
                className="px-3 sm:px-5 py-1.5 sm:py-2 bg-white border-2 border-red-600 text-red-600 rounded-full font-semibold hover:bg-red-50 transition-all text-xs sm:text-sm"
              >
                Login
              </Link>

              {/* Sign Up Button - Hidden on small mobile */}
              <Link
                to="/sign-up"
                className="hidden sm:inline-block px-3 sm:px-5 py-1.5 sm:py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition-all text-xs sm:text-sm"
              >
                Sign Up
              </Link>

              {/* Google Sign-In Button */}
              <div className="relative">
                <button
                  onClick={() => setShowGoogleSignIn(!showGoogleSignIn)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-white border-2 border-gray-300 rounded-full hover:border-red-500 hover:shadow-md transition-all"
                  title="Sign in with Google"
                >
                  <FcGoogle className="text-lg sm:text-xl" />
                  <span className="hidden lg:inline text-sm font-medium text-gray-700">Google</span>
                </button>

                {/* Google Login Popup */}
                {showGoogleSignIn && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 bg-black bg-opacity-30 z-40"
                      onClick={() => setShowGoogleSignIn(false)}
                    ></div>

                    {/* Popup */}
                    <div className="absolute top-full right-0 mt-2 bg-white shadow-2xl rounded-xl p-5 border border-gray-200 z-50 w-[300px]">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-base font-bold text-gray-800">Sign in with Google</h3>
                        <button
                          onClick={() => setShowGoogleSignIn(false)}
                          className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        >
                          ×
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <GoogleLogin
                          onSuccess={handleGoogleSuccess}
                          onError={handleGoogleError}
                          theme="outline"
                          size="large"
                          text="continue_with"
                          shape="rectangular"
                          width="260"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
