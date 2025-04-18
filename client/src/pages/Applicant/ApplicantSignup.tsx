import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { toast } from "react-toastify";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

import {
  useApplicantSignupMutation,
  useApplicantGoogleSignupMutation,
} from "../../api/endpoints/applicantApi";
import { useDispatch } from "react-redux";
import { setApplicantCredentials } from "../../redux/slices/applicantSlice";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";

const signupSchema = z
  .object({
    name: z.string().min(2, "Full name is too short"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

const ApplicantSignup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signup, { isLoading }] = useApplicantSignupMutation();
  const [googleSignup, { isLoading: isGoogleLoading }] =
    useApplicantGoogleSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    await signup(data).unwrap();
    navigate("/verify", { state: { email: data.email } });
  };

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Missing Google credentials");
      return;
    }

    const res = await googleSignup({ token: response.credential }).unwrap();
    dispatch(
      setApplicantCredentials({
        applicant: res.user,
        accessToken: res.accessToken,
        role: res.role,
      })
    );
    navigate("/signin");
  };

  const handleGoogleFailure = () => {
    toast.error("Google login failed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create Jobseeker Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Find your dream job today
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <input
              id="name"
              {...register("name")}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
              placeholder="you@example.com"
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
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
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
              } focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
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
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-all ${
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
              to="/signin"
              className="text-emerald-600 hover:text-emerald-800 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicantSignup;
