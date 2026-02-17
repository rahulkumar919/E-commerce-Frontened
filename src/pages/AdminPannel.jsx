import { FaUserAlt, FaUsers, FaBox, FaSignOutAlt, FaTags, FaGlobe, FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminPannel = () => {
  const user = useSelector((state) => state?.user.user);
  const navigate = useNavigate();
  
  const handlelogout = () => {
    navigate("/");
    toast.success("Log Out Successfully");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* ✅ Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-5 overflow-y-auto">
        {/* 👤 Admin Info */}
        <div className="flex flex-col items-center mb-8">
          {user?.profilePic ? (
            <img
              src={user.profilePic}
              alt={user.name}
              className="w-16 h-16 rounded-full border-2 border-red-500 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-3xl">
              <FaUserAlt />
            </div>
          )}

          <h2 className="mt-3 font-semibold text-gray-800 text-lg capitalize">{user?.role}</h2>
          <h2 className="mt-1 font-semibold text-gray-800 text-base capitalize">{user?.name}</h2>
          <p className="text-sm text-gray-500 text-center break-all">{user?.email}</p>
        </div>

        {/* 🧭 Navigation Links */}
        <nav className="flex flex-col gap-2">
          <Link
            to="users"
            className="flex items-center gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-md transition"
          >
            <FaUsers /> Users
          </Link>

          <Link
            to="products"
            className="flex items-center gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-md transition"
          >
            <FaBox /> Products
          </Link>

          <Link
            to="categories"
            className="flex items-center gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-md transition"
          >
            <FaTags /> Categories
          </Link>

          <Link
            to="banners"
            className="flex items-center gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-md transition"
          >
            <FaImage /> Banners
          </Link>

          <Link
            to="site-settings"
            className="flex items-center gap-3 text-gray-700 hover:bg-red-50 hover:text-red-600 px-4 py-2 rounded-md transition"
          >
            <FaGlobe /> Site Settings
          </Link>
        </nav>

        {/* 🚪 Logout Button */}
        <div className="mt-auto pt-4">
          <button
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-md hover:bg-red-700 transition"
            onClick={handlelogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* ✅ Main Content with Outlet */}
      <main className="flex-1 p-4 sm:p-8 w-full h-full overflow-y-auto">
        {/* This is where nested routes (Dashboard, Users, etc.) will appear */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPannel;
