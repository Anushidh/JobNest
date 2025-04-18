import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import {
  useGoogleSignupMutation,
  useSignupMutation,
} from "../../api/endpoints/employerApi";
import { useDispatch } from "react-redux";
import { setEmployerCredentials } from "../../redux/slices/employerSlice";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";

const signupSchema = z
  .object({
    companyName: z.string().min(2, "Company name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const EmployerSignup = () => {
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

  const onSubmit = async (data: SignupFormData) => {
    try {
      console.log(data);
      const result = await signup(data).unwrap();
      console.log("Signup success:", result);
      navigate("/employer/verify", { state: { email: data.email } });
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

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Google login failed.");
      return;
    }
    try {
      const res = await googleSignup({ token: response.credential }).unwrap();
      dispatch(
        setEmployerCredentials({
          employer: res.user,
          accessToken: res.accessToken,
          role: res.role,
        })
      );
      toast.success("Google signup successful!");
      navigate("/employer");
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

  const handleGoogleFailure = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Employer Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Start building your team today
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name *
            </label>
            <input
              id="companyName"
              {...register("companyName")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.companyName ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              placeholder="Your company name"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyName.message}
              </p>
            )}
          </div>

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
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              placeholder="company@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password *
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password *
            </label>
            <input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
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
  );
};

export default EmployerSignup;
