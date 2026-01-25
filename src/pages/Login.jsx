import React, { useState, useContext } from "react";
import { FaSignInAlt, FaEye, FaEyeSlash } from "react-icons/fa";
import user from "../assets/user.png";
import { Link, useNavigate } from "react-router-dom";
import summaryApi from "../../common";
import { toast } from "react-toastify";
import { Context } from "../App";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const navigate = useNavigate();

  // ✅ Correct function name
  const { fetchUserDetails, fetchUserAddToCount } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      toast.error("Please enter email and password");
      return;
    }

    if (!isValidGmail(data.email)) {
      alert("Please enter a valid Gmail address");
      return;
    }

    const isValidGmail = (email) => {
      const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      return gmailRegex.test(email);
    };

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
    <section id="login">
      <div className="mx-auto container">
        <div className="bg-white p-5 w-full max-w-sm mt-3 mx-auto rounded shadow-lg">
          <div className="w-14 h-15 mx-auto">
            <img src={user} alt="user-icon" />
          </div>

          <form className="pt-5" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Email ID :</label>
              <div className="bg-slate-200 p-2">
                <input
                  type="email"
                  placeholder="Enter the Email Id"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full h-full outline-none bg-transparent"
                />
              </div>
            </div>

            <div className="grid mt-3">
              <label>Password :</label>
              <div className="bg-slate-200 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter the Password"
                  name="password"
                  value={data.password}
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

              <Link
                to={"/forget-password"}
                className="ml-auto block hover:underline hover:text-red-500"
              >
                Forget Password
              </Link>
            </div>

            <button
              type="submit"
              className="font-bold flex items-center justify-center bg-red-500 col-auto px-6 py-2 w-full max-w-[140px] rounded-full hover:scale-110 transition-all text-white mt-3 mx-auto"
            >
              Login
            </button>
          </form>

          <p className="my-5">
            Don't have Account?{" "}
            <Link
              to={"/sign-up"}
              className="hover:text-red-800 hover:scale-110 duration-300 text-red-400 font-semibold hover:underline"
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
