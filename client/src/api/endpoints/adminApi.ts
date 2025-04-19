import { Admin } from "../../types/adminTypes";
import { Applicant } from "../../types/applicantTypes";
import { Employer } from "../../types/employerTypes";
import { baseApi } from "../baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    adminLogin: builder.mutation<
      {
        message: string;
        user: Admin;
        accessToken: string;
        role: string;
      },
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),

    adminLogout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/admin/logout",
        method: "POST",
      }),
    }),
    // Data Fetching Endpoints
    getAllApplicants: builder.query<
      {
        applicants: Applicant[];
        total: number;
        pages: number;
        currentPage: number;
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/applicants?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    toggleApplicantBlockStatus: builder.mutation<Applicant, string>({
      query: (id) => ({
        url: `/admin/applicants/${id}/block-status`,
        method: "PATCH",
      }),
    }),
    getAllEmployers: builder.query<
      {
        employers: Employer[];
        total: number;
        pages: number;
        currentPage: number;
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/admin/employers?page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    toggleEmployerBlockStatus: builder.mutation<Employer, string>({
      query: (id) => ({
        url: `/admin/employers/${id}/block-status`,
        method: "PATCH",
      }),
    }),

    adminRefreshToken: builder.mutation({
      query: () => ({
        url: "/admin/refresh",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useAdminLoginMutation,
  useAdminLogoutMutation,
  useAdminRefreshTokenMutation,
  useGetAllApplicantsQuery,
  useToggleApplicantBlockStatusMutation,
  useGetAllEmployersQuery,
  useToggleEmployerBlockStatusMutation,
} = adminApi;
