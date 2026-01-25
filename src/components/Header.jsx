import React, { useContext, useState, useEffect } from "react";
import { FaSearch, FaUserAlt, FaCartPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import rkk from "../assets/rkk.jpg";
import summaryApi from "../../common";
import { toast } from "react-toastify";
import { Context } from "../App";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../store/userSlice";
import ROLE from "../../common/role";

const Header = () => {
  const navigate = useNavigate();
  const { fetchUserDetails, cartProductCount } = useContext(Context);
  const dispatch = useDispatch();
  
  const { user, setUser } = useContext(Context);

  // ✅ States
  const [click, setClick] = useState(false);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // ✅ Logout
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

  // ✅ Fetch Search Suggestions
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

  // Handle Search Submit (Enter or Button)
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
    <header className="h-16 shadow-md bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-4">
        {/* 🏠 Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group hover:scale-105 transition-transform"
        >
          <img
            src={rkk}
            alt="logo"
            className="w-12 h-12 object-cover rounded-full shadow-md group-hover:rotate-6 duration-300"
          />
          <h1 className="text-xl font-bold text-gray-800 group-hover:text-red-600 transition-colors">
            RK<span className="text-red-600">Shop</span>
          </h1>
        </Link>

        {/* 🔍 Search Box */}
        <div className="relative hidden md:block w-96">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center border rounded-full px-3 py-1 bg-white focus-within:shadow-lg transition"
          >
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products..."
              className="flex-1 outline-none px-2 text-gray-700"
            />
            <button
              type="submit"
              className="bg-red-600 text-white p-2 rounded-full hover:bg-red-500 transition-colors"
            >
              <FaSearch />
            </button>
          </form>

          {/* 🔽 Search Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow-lg rounded-lg mt-1 z-50 max-h-80 overflow-y-auto animate-fadeIn">
              {loadingSearch && (
                <p className="p-2 text-gray-500 text-center text-sm">
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
                  className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer transition-all"
                >
                  <img
                    src={item?.productImage?.[0]}
                    alt={item.productName}
                    className="w-12 h-12 object-contain bg-gray-50 rounded-md"
                  />
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-gray-800 truncate w-52">
                      {item.productName}
                    </p>
                    <p className="text-xs text-red-500 font-medium">
                      ₹{item.selling}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 👤 User / Cart / Auth Buttons */}
        <div className="flex items-center gap-6">
          {/* 👤 User Icon */}
          <div
            className="relative flex justify-center"
            onClick={() => setClick((prev) => !prev)}
          >
            <div
              className="text-2xl text-gray-700 hover:text-red-600 cursor-pointer transition-transform hover:scale-125"
              title="User Account"
            >
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-11 h-11 rounded-full"
                />
              ) : (
                <FaUserAlt />
              )}
            </div>
            {click && (
              <div className="absolute top-12 bg-white shadow-xl rounded-lg p-2 border border-gray-200 w-40 text-gray-800 font-bold hidden md:block">
                <nav>
                  {user?.role === ROLE.ADMIN && (
                    <Link to={"/admin-pannel"}>Admin Panel</Link>
                  )}
                </nav>
              </div>
            )}
          </div>

          {/* 🛒 Cart */}
          <Link
            to="/cart"
            className="relative text-2xl text-gray-700 hover:text-red-600 transition-transform hover:scale-125"
          >
            <FaCartPlus />
            {user?._id && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-bold px-2 py-[1px] rounded-full shadow-md">
                {cartProductCount || 0}
              </span>
            )}
          </Link>

          {/* 🔘 Login / Logout */}
          <div>
            {user?._id ? (
              <button
                onClick={handleLogout}
                className="px-5 bg-red-600 rounded-full py-1 text-white font-semibold hover:bg-red-500 hover:scale-110 transition-all"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-5 bg-red-600 rounded-full py-1 text-white font-semibold hover:bg-red-500 hover:scale-110 transition-all"
              >
                Login
              </Link>
            )}
          </div>

            <div>
              <Link to={"/sign-up"} className="px-5  bg-red-700  rounded-full py-1 text-white font-semibold hover:bg-red-600 transition-all ">
                Sign Up 
              </Link>
            </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
