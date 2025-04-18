import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

import {
  useApplicantGoogleLoginMutation,
  useApplicantLoginMutation,
} from "../../api/endpoints/applicantApi";
import { setApplicantCredentials } from "../../redux/slices/applicantSlice";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const ApplicantSignin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useApplicantLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useApplicantGoogleLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const res = await login(data).unwrap();
    dispatch(
      setApplicantCredentials({
        applicant: res.user,
        accessToken: res.accessToken,
        role: res.role,
      })
    );
    toast.success("Login successful!");
    navigate("/dashboard");
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Google authentication failed - no credential received");
      return;
    }
    const res = await googleLogin({ token: response.credential }).unwrap();
    dispatch(
      setApplicantCredentials({
        applicant: res.user,
        accessToken: res.accessToken,
        role: res.role,
      })
    );
    navigate("/applicant/dashboard");
  };

  const handleGoogleFailure = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">Welcome back, jobseeker!</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password with toggle */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={`w-full px-4 py-3 pr-10 rounded-lg border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                placeholder="••••••••"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible className="w-5 h-5" />
                ) : (
                  <AiOutlineEye className="w-5 h-5" />
                )}
              </span>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-sm text-[rgb(88,81,211)] hover:text-[rgb(72,67,180)] font-medium"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg bg-[rgb(88,81,211)] hover:bg-[rgb(72,67,180)] text-white font-medium transition-all ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <ImSpinner8 className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        {/* Separator */}
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

        {/* Google Login */}
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

        {/* Signup Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-[rgb(88,81,211)] hover:text-[rgb(72,67,180)] font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantSignin;
