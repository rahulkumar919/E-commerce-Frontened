import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import user from "../assets/user.png";
import imageTobase64 from "../PhotoHelper/imgeResizing";
import summaryApi from "../../common";
import { toast } from "react-toastify";

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
    if (!formData.email || !formData.password) {
      toast.error("Please enter email and password");
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

    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message);
        navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        // navigate("/login")
      } else {
        toast.error(result.message);
      }
      console.log("API Response:", result);
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
    <section id="signup">
      <div className="mx-auto container">
        <div className="bg-white p-5 w-full max-w-sm mt-3 mx-auto rounded shadow-lg">
          {/* Profile Pic Upload */}
          <div className="w-16 h-16 mx-auto relative rounded-full overflow-hidden">
            <img
              src={formData.profilePic || user}
              alt="user-icon"
              className="w-full h-full object-cover rounded-full"
            />
            <form className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-x cursor-pointer font-semibold">
              Upload Photo
              <input
                type="file"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleUploadPic}
              />
            </form>
          </div>

          {/* Signup Form */}
          <form className="pt-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="grid">
              <label>Name :</label>
              <div className="bg-slate-200 p-2">
                <input
                  type="text"
                  placeholder="Enter Name"
                  name="name"
                  value={formData.name}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Email */}
            <div className="grid">
              <label>Email ID :</label>
              <div className="bg-slate-200 p-2">
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                  required
                  value={formData.email}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid mt-3">
              <label>Password :</label>
              <div className="bg-slate-200 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  name="password"
                  value={formData.password}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="grid mt-3">
              <label>Confirm Password :</label>
              <div className="bg-slate-200 p-2 flex">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowConfirmPass((prev) => !prev)}
                >
                  {showConfirmPass ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="font-bold flex items-center justify-center bg-red-500 col-auto px-6 py-2 w-full max-w-[140px] rounded-full hover:scale-110 transition-all text-white mt-3 mx-auto"
            >
              {/* Verify  OTP  */}
              SignUP
            </button>
          </form>

          {/* Login Link */}
          <p className="my-5 text-center">
            Already have an account?{" "}
            <Link
              to={"/login"}
              className="hover:text-red-800 hover:scale-110 duration-300 text-red-400 font-semibold hover:underline"
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
