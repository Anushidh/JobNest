import { baseApi } from "../baseApi";

export const employerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/employer/login",
        method: "POST",
        body: credentials,
      }),
    }),
    signup: builder.mutation({
      query: (user) => ({
        url: "/employer/signup",
        method: "POST",
        body: user,
      }),
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: "/employer/logout",
        method: "POST",
        body: data,
      }),
    }),
    googleSignup: builder.mutation({
      query: (token) => ({
        url: "/employer/google-signup",
        method: "POST",
        body: { token },
      }),
    }),
    googleLogin: builder.mutation({
      query: (token) => ({
        url: "/employer/google-login",
        method: "POST",
        body: { token },
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/employer/verify",
        method: "POST",
        body: data,
      }),
    }),
    checkBlockStatus: builder.query({
      query: (id) => `/employer/block-status/${id}`,
    }),
    test: builder.query<string, void>({
      query: () => `/employer/test`,
    }),
    forgotPassword: builder.mutation({
      query: (email) => ({
        url: "/employer/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    editEmployer: builder.mutation({
      query: ({ data }) => ({
        url: `/employer/update-profile`,
        method: "PUT",
        body: data,
      }),
    }),
    uploadLogo: builder.mutation({
      query: (formData: FormData) => ({
        url: "/employer/upload-logo",
        method: "POST",
        body: formData,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/employer/refresh",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useGoogleLoginMutation,
  useVerifyOtpMutation,
  useCheckBlockStatusQuery,
  useForgotPasswordMutation,
  useGoogleSignupMutation,
  useEditEmployerMutation,
  useRefreshTokenMutation,
  useUploadLogoMutation,
  useTestQuery,
} = employerApi;
