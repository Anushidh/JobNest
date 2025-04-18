import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { toast } from "react-toastify";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import {
  useLoginMutation,
  useGoogleSignupMutation,
} from "../../api/endpoints/employerApi";
import { useDispatch } from "react-redux";
import { setEmployerCredentials } from "../../redux/slices/employerSlice";
import { FcGoogle } from "react-icons/fc";
import { ImSpinner8 } from "react-icons/im";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const EmployerSignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [googleSignup, { isLoading: isGoogleLoading }] =
    useGoogleSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
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
    } catch (error: unknown) {
      let errorMessage = "Invalid credentials.";
      if (typeof error === "object" && error !== null && "status" in error) {
        const err = error as FetchBaseQueryError;
        if ("data" in err) {
          errorMessage =
            (err.data as { message?: string }).message || errorMessage;
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
      toast.success("Google login successful!");
      navigate("/employer/dashboard");
    } catch (error: unknown) {
      let errorMessage = "Invalid credentials.";
      if (typeof error === "object" && error !== null && "status" in error) {
        const err = error as FetchBaseQueryError;
        if ("data" in err) {
          errorMessage =
            (err.data as { message?: string }).message || errorMessage;
        }
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Employer Sign In</h2>
          <p className="mt-2 text-sm text-gray-600">
            Welcome back to your hiring dashboard
          </p>
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                to="/employer/forgot-password"
                className="font-medium text-indigo-600 hover:text-indigo-500"
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
              className={`w-full flex justify-center items-center py-3 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all ${
                isLoading ? "opacity-80 cursor-not-allowed" : ""
              }`}
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
            onClick={() =>
              document.querySelector('div[role="button"]')?.click()
            }
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
              onError={() => toast.error("Google Login Failed")}
            />
          </div>
        </div>

        {/* Signup Link */}
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
  );
};

export default EmployerSignIn;
