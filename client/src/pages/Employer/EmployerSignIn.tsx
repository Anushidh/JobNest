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

import {
  useLoginMutation,
  useGoogleLoginMutation,
} from "../../api/endpoints/employerApi";
import { setEmployerCredentials } from "../../redux/slices/employerSlice";
import { signinSchema } from "../../zod-schemas/schemas";

type SigninFormData = z.infer<typeof signinSchema>;

const EmployerSignin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [googleLogin, { isLoading: isGoogleLoading }] =
    useGoogleLoginMutation();

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Google login failed.");
      return;
    }

    const res = await googleLogin(response.credential).unwrap();
    dispatch(
      setEmployerCredentials({
        employer: res.user,
        accessToken: res.accessToken,
        role: res.role,
      })
    );
    toast.success("Google sign-in successful!");
    navigate("/employer");
  };

  const handleGoogleFailure = () => {
    toast.error("Google login failed");
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninFormData) => {
    const result = await login(data).unwrap();
    dispatch(
      setEmployerCredentials({
        employer: result.user,
        accessToken: result.accessToken,
        role: result.role,
      })
    );
    toast.success("Login successful!");
    navigate("/employer/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side Text (only on lg) */}
      <div className="hidden lg:flex lg:w-[60%] bg-gray-100 p-10 items-center justify-center">
        <div className="max-w-xl text-center">
          <h2 className="text-5xl font-bold text-indigo-900 mb-6 leading-snug">
            Welcome Back to <br />
            <span className="text-[#0d9488]">Next-Gen Recruitment</span>
          </h2>
          <p className="text-gray-700 text-lg">
            Sign in to continue discovering top talent and building your dream
            team. Let’s take your recruitment process to the next level.
          </p>
        </div>
      </div>

      {/* Right: Sign In Form */}
      <div className="w-full lg:w-[40%] flex items-center justify-center bg-white p-6 lg:p-10 min-h-screen lg:min-h-0">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 uppercase">
              JobNest
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
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

            {/* Password */}
            <div className="mb-6 relative">
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  {...register("password")}
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

            {/* Submit */}
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
                  Signing in...
                </>
              ) : (
                "Sign In"
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

          {/* Google Sign In */}
          <div className="mt-6">
            <button
              onClick={() => {
                const googleBtn = document.querySelector(
                  'div[role="button"]'
                ) as HTMLElement | null;
                googleBtn?.click();
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

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/employer/signup"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerSignin;
