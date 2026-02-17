import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import user from "../assets/user.png";
import { Link, useNavigate } from "react-router-dom";
import summaryApi from "../../common";
import { toast } from "react-toastify";
import { Context } from "../App";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  // Correct function name
  const { fetchUserDetails } = useContext(Context);

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

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Server returned non-JSON response:", await response.text());
        toast.error("Server error. Please make sure backend is deployed with Google Auth route.");
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        await fetchUserDetails();
        navigate("/");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error("Google sign-in failed. Please check console for details.");
    }
  };

  // Handle Google Login Error
  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed");
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      toast.error("Please enter email and password");
      return;
    }

    if (!isValidGmail(data.email)) {
      toast.error("Please enter a valid Gmail address");
      return;
    }

    try {
      const res = await fetch(summaryApi.signin.url, {
        method: summaryApi.signin.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const dataApi = await res.json();
      console.log("Login Response:", dataApi);

      if (res.ok && dataApi.success) {
        toast.success(dataApi.message || "Login Successful");

        // ✅ Call context function

        // ✅ Redirect to home
        navigate("/");
        fetchUserDetails();
      } else {
        toast.error(dataApi.message || "Invalid Credentials");
      }
    } catch (err) {
      console.error("Login Error:", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <section id="login" className="min-h-screen flex items-center justify-center py-6 px-3 bg-gray-50">
      <div className="w-full max-w-[340px] sm:max-w-md">
        <div className="bg-white p-5 sm:p-7 rounded-lg shadow-xl">
          {/* User Icon */}
          <div className="w-20 h-20 mx-auto mb-4">
            <img src={user} alt="user-icon" className="w-full h-full" />
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-5">
            Welcome Back
          </h2>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                value={data.email}
                onChange={handleOnChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>

              <Link
                to={"/forget-password"}
                className="block text-right text-xs text-red-500 hover:text-red-600 hover:underline mt-1.5 transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors mt-5"
            >
              Login
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-3 text-gray-500 text-xs font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Google Sign-In Button */}
          <div className="flex justify-center">
            <div className="w-full max-w-[280px]">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                width="280"
              />
            </div>
          </div>

          {/* SignUp Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to={"/sign-up"}
              className="text-red-500 font-semibold hover:text-red-600 hover:underline transition"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
