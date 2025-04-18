import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router";

import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useVerifyOtpMutation } from "../../api/endpoints/employerApi";

const OtpForm = () => {
  const { handleSubmit, setValue } = useForm();
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();
  const email = location.state?.email;
  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setValue("otp", newOtp.join(""));

    // Move to the next input field if a digit is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key to move focus back
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async () => {
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit OTP");
      return;
    }

    try {
      await verifyOtp({ email, otp: otpCode }).unwrap();
      toast.success("OTP Verified Successfully!");
      navigate("/employer/signin");
    } catch (error: unknown) {
      let errorMessage = "Something went wrong.";

      if (typeof error === "object" && error !== null && "status" in error) {
        const err = error as FetchBaseQueryError;

        if ("data" in err) {
          if (typeof err.data === "string") {
            errorMessage = err.data;
          } else if (typeof err.data === "object" && err.data !== null) {
            errorMessage =
              (err.data as { message?: string }).message || errorMessage;
          }
        }
      }

      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Enter OTP</h2>
        <p className="text-gray-600 text-center mb-4">
          A 6-digit OTP has been sent to your email/phone.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <div className="flex space-x-2 mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpForm;
