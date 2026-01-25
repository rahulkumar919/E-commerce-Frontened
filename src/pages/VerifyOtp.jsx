import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import summaryApi from "../../common";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      toast.error("Email not found. Please sign up again.");
      navigate("/sign-up");
    }
  }, [email, navigate]);

  // ✅ VERIFY OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    try {
      console.log("Verifying OTP for:", email, "with OTP:", otp);

      const response = await fetch(summaryApi.VerifyOtp.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log("🔍 Verify OTP Response:", data);

      if (data.success) {
        toast.success(" Email verified successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error(" Verify OTP Error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  //  RESEND OTP
  const handleResend = async () => {
    try {
      const response = await fetch(summaryApi.ResendOtp.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("🔁 Resend OTP Response:", data);

      if (data.success) {
        toast.success("New OTP sent to your email!");
      } else {
        toast.error(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP Error:", error);
      toast.error("Something went wrong while resending OTP");
    }
  };

  return (
    <section className="mx-auto container flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-3">Email Verification</h2>
        <p className="text-center text-gray-600 mb-5">
          We sent a 6-digit OTP to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 rounded text-center tracking-widest text-lg"
            maxLength={6}
          />

          <button
            type="submit"
            className="bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600"
          >
            Verify OTP
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-500 text-sm mb-2">Didn’t get the OTP?</p>
          <button
            onClick={handleResend}
            className="text-red-600 font-semibold hover:underline"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </section>
  );
};

export default VerifyOtp;
