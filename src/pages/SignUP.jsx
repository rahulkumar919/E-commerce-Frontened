import { useState, useContext } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import user from "../assets/user.png";
import imageTobase64 from "../PhotoHelper/imgeResizing";
import summaryApi from "../../common";
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Context } from "../App";

const SignUP = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
    profilePic: "",
  });

  const navigate = useNavigate();
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

  // handle input change
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidGmail = (email) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return gmailRegex.test(email);
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // check fields
    if (!formData.email || !formData.password || !formData.name) {
      toast.error("Please fill all required fields");
      return;
    }

    if(!isValidGmail(formData.email)) {
      toast.error("Please enter a valid Gmail address");
      return;
    }

    // check password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check password strength
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      toast.info("Sending OTP to your email...");
      
      // Send OTP instead of directly creating user
      const response = await fetch(summaryApi.SendOtp.url, {
        method: summaryApi.SendOtp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password,
          profilePic: formData.profilePic,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("OTP sent to your email! Please verify.");
        // Navigate to OTP verification page
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
      console.log("OTP Response:", result);
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // handle profile picture upload
  const handleUploadPic = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imagePic = await imageTobase64(file);
      setFormData((prev) => ({
        ...prev,
        profilePic: imagePic,
      }));
    }
  };

  return (
    <section id="signup" className="min-h-screen flex items-center justify-center py-6 px-3 bg-gray-50">
      <div className="w-full max-w-[340px] sm:max-w-md">
        <div className="bg-white p-5 sm:p-7 rounded-lg shadow-xl">
          {/* Profile Pic Upload */}
          <div className="w-20 h-20 mx-auto relative rounded-full overflow-hidden mb-4 border-2 border-gray-200">
            <img
              src={formData.profilePic || user}
              alt="user-icon"
              className="w-full h-full object-cover"
            />
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white text-[10px] sm:text-xs cursor-pointer font-medium hover:bg-opacity-70 transition">
              <span className="text-center px-2">Upload</span>
              <input
                type="file"
                className="hidden"
                onChange={handleUploadPic}
                accept="image/*"
              />
            </label>
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-5">
            Create Account
          </h2>

          {/* Signup Form */}
          <form className="space-y-3.5" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleOnChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                name="email"
                pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                required
                value={formData.email}
                onChange={handleOnChange}
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
                  placeholder="Enter password"
                  name="password"
                  value={formData.password}
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
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleOnChange}
                  required
                  className="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm transition"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPass((prev) => !prev)}
                >
                  {showConfirmPass ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors mt-5"
            >
              Sign Up
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
                text="signup_with"
                shape="rectangular"
                width="280"
              />
            </div>
          </div>

          {/* Login Link */}
          <p className="mt-5 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="text-red-500 font-semibold hover:text-red-600 hover:underline transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default SignUP;
