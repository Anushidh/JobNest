import { ApplicantPlan } from "../../types/applicantTypes";
import { EmployerPlan } from "../../types/employerTypes";
import { baseApi } from "../baseApi";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all employer plans
    getAllEmployerPlans: builder.query<EmployerPlan[], void>({
      query: () => ({
        url: "/plans/employer",
        method: "GET",
      }),
      transformResponse: (response: { plans: EmployerPlan[] }) =>
        response.plans,
    }),

    // Get employer plan by ID
    getEmployerPlanById: builder.query<EmployerPlan, string>({
      query: (id) => ({
        url: `/plans/employer/${id}`,
        method: "GET",
      }),
      transformResponse: (response: { plan: EmployerPlan }) => response.plan,
    }),

    // Create new employer plan
    createEmployerPlan: builder.mutation<
      EmployerPlan,
      Omit<EmployerPlan, "_id" | "createdAt" | "updatedAt">
    >({
      query: (planData) => ({
        url: "/plans/employer",
        method: "POST",
        body: planData,
      }),
    }),

    // Update employer plan
    updateEmployerPlan: builder.mutation<
      EmployerPlan,
      { id: string; data: Partial<EmployerPlan> }
    >({
      query: ({ id, data }) => ({
        url: `/plans/employer/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),

    getAllApplicantPlans: builder.query<ApplicantPlan[], void>({
      query: () => ({
        url: "/plans/applicant", // Endpoint to fetch all applicant plans
        method: "GET",
      }),
      transformResponse: (response: { plans: ApplicantPlan[] }) =>
        response.plans,
    }),

    // Get applicant plan by ID
    getApplicantPlanById: builder.query<ApplicantPlan, string>({
      query: (id) => ({
        url: `/plans/applicant/${id}`, // Endpoint to fetch a plan by ID
        method: "GET",
      }),
      transformResponse: (response: { plan: ApplicantPlan }) => response.plan,
    }),

    // Create new applicant plan
    createApplicantPlan: builder.mutation<
      ApplicantPlan,
      Omit<ApplicantPlan, "_id" | "createdAt" | "updatedAt">
    >({
      query: (planData) => ({
        url: "/plans/applicant", // Endpoint for creating a new applicant plan
        method: "POST",
        body: planData,
      }),
    }),

    // Update applicant plan
    updateApplicantPlan: builder.mutation<
      ApplicantPlan,
      { id: string; data: Partial<ApplicantPlan> }
    >({
      query: ({ id, data }) => ({
        url: `/plans/applicant/${id}`, // Endpoint to update an applicant plan by ID
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetAllEmployerPlansQuery,
  useGetEmployerPlanByIdQuery,
  useCreateEmployerPlanMutation,
  useUpdateEmployerPlanMutation,
  useGetAllApplicantPlansQuery,
  useGetApplicantPlanByIdQuery,
  useCreateApplicantPlanMutation,
  useUpdateApplicantPlanMutation,
} = planApi;
