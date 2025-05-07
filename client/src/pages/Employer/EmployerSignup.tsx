import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { ImSpinner8 } from "react-icons/im";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import { signupSchema } from "../../zod-schemas/schemas";
import {
  useGoogleSignupMutation,
  useSignupMutation,
} from "../../api/endpoints/employerApi";
import { setEmployerCredentials } from "../../redux/slices/employerSlice";

type SignupFormData = z.infer<typeof signupSchema>;

const EmployerSignup = () => {
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // State for confirm password visibility
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();
  const [googleSignup, { isLoading: isGoogleLoading }] =
    useGoogleSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Google login failed.");
      return;
    }
    console.log(response.credential);
    console.log(response.credential.split(".").length);

    const res = await googleSignup(response.credential ).unwrap();
    dispatch(
      setEmployerCredentials({
        employer: res.user,
        accessToken: res.accessToken,
        role: res.role,
      })
    );
    toast.success("Google signup successful!");
    navigate("/employer");
  };

  const handleGoogleFailure = () => {
    toast.error("Google login failed");
  };

  const onSubmit = async (data: SignupFormData) => {
    console.log(data);
    const { confirmPassword, ...signupData } = data;
    const result = await signup(signupData).unwrap();
    console.log("Signup success:", result);
    navigate("/employer/verify", { state: { email: data.email } });
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Signup Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white p-6 lg:p-10 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">
              JobNest
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to get started
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Company Name
              </label>
              <input
                type="text"
                {...register("companyName")}
                className={`w-full border border-gray-300 rounded px-3 py-2 ${
                  errors.companyName ? "border-red-500" : ""
                }`}
                placeholder="Enter company name"
              />
              {errors.companyName && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.companyName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register("email")}
                className={`w-full border border-gray-300 rounded px-3 py-2 ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-4 relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`w-full border border-gray-300 rounded px-3 py-2 pr-10 ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  {passwordVisible ? (
                    <AiOutlineEyeInvisible size={18} />
                  ) : (
                    <AiOutlineEye size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value, formValues) =>
                      value === formValues.password || "Passwords don't match",
                  })}
                  className={`w-full border border-gray-300 rounded px-3 py-2 pr-10 ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                  onClick={() =>
                    setConfirmPasswordVisible(!confirmPasswordVisible)
                  }
                >
                  {confirmPasswordVisible ? (
                    <AiOutlineEyeInvisible size={18} />
                  ) : (
                    <AiOutlineEye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors flex justify-center items-center ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Signup */}
          <div className="mt-6">
            <button
              onClick={() => {
                const googleButton = document.querySelector(
                  'div[role="button"]'
                ) as HTMLElement | null;
                googleButton?.click();
              }}
              disabled={isGoogleLoading}
              className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 transition-all ${
                isGoogleLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isGoogleLoading ? (
                <ImSpinner8 className="animate-spin mr-2" />
              ) : (
                <FcGoogle className="w-5 h-5 mr-2" />
              )}
              Google
            </button>
            <div className="hidden">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
              />
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/employer/signin"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Visible only on large screens */}
      <div className="hidden lg:flex lg:w-[60%] bg-gray-100 p-10 items-center justify-center">
        <div className="max-w-xl text-center">
          <h2 className="text-5xl font-bold text-indigo-900 mb-6 leading-snug">
            Start Your Journey with <br />
            <span className="text-[#0d9488]">Next-Gen Recruitment</span>
          </h2>
          <p className="text-gray-700 text-lg">
            Discover the easiest way to connect with top talent and grow your
            company. Our platform helps you find the right people, faster.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignup;
