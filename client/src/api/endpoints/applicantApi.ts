import { baseApi } from "../baseApi";

export const applicantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    applicantLogin: builder.mutation({
      query: (credentials) => ({
        url: "/applicant/login",
        method: "POST",
        body: credentials,
      }),
    }),
    applicantSignup: builder.mutation({
      query: (user) => ({
        url: "/applicant/signup",
        method: "POST",
        body: user,
      }),
    }),
    applicantLogout: builder.mutation({
      query: (data) => ({
        url: "/applicant/logout",
        method: "POST",
        body: data,
      }),
    }),
    applicantGoogleSignup: builder.mutation({
      query: (token) => ({
        url: "/applicant/google-signup",
        method: "POST",
        body: { token },
      }),
    }),
    applicantGoogleLogin: builder.mutation({
      query: (token) => ({
        url: "/applicant/google-login",
        method: "POST",
        body: { token },
      }),
    }),
    applicantVerifyOtp: builder.mutation({
      query: (data) => ({
        url: "/applicant/verify",
        method: "POST",
        body: data,
      }),
    }),
    applicantCheckBlockStatus: builder.query({
      query: (id) => `/applicant/block-status/${id}`,
    }),
    applicantTest: builder.query<string, void>({
      query: () => `/applicant/test`,
    }),
    applicantForgotPassword: builder.mutation({
      query: (email) => ({
        url: "/applicant/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    applicantRefreshToken: builder.mutation({
      query: () => ({
        url: "/applicant/refresh",
        method: "POST",
      }),
    }),
    editApplicant: builder.mutation({
      query: ({ data }) => ({
        url: `/applicant/update-profile`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useApplicantLoginMutation,
  useApplicantSignupMutation,
  useApplicantLogoutMutation,
  useApplicantGoogleLoginMutation,
  useApplicantGoogleSignupMutation,
  useApplicantVerifyOtpMutation,
  useApplicantCheckBlockStatusQuery,
  useApplicantTestQuery,
  useApplicantForgotPasswordMutation,
  useApplicantRefreshTokenMutation,
  useEditApplicantMutation,
} = applicantApi;
