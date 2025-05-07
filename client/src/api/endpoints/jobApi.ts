import { Job } from "../../types/applicantTypes";
import { baseApi } from "../baseApi";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---------------- Employer APIs ----------------

    // Create new job
    createJob: builder.mutation({
      query: (jobData) => ({
        url: "/jobs/employer",
        method: "POST",
        body: jobData,
      }),
    }),

    // Get employer's jobs
    getEmployerJobs: builder.query<Job[], void>({
      query: () => "/jobs/employer",
    }),

    // Get job by ID
    getJob: builder.query({
      query: (id) => `/jobs/employer/${id}`,
    }),

    // Update job
    updateJob: builder.mutation({
      query: ({ id, ...updates }) => ({
        url: `/jobs/employer/${id}`,
        method: "PUT",
        body: updates,
      }),
    }),

    // Delete job
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/employer/${id}`,
        method: "DELETE",
      }),
    }),

    getApplicationsForJob: builder.query({
      query: (jobId: string) => `/jobs/applications/${jobId}`,
    }),

    toggleApplicationStatus: builder.mutation({
      query: (applicationId: string) => ({
        url: `/jobs/${applicationId}/toggle-status`,
        method: "PATCH",
      }),
    }),
    
    // ---------------- Applicant APIs ----------------

    // List all jobs (with pagination)
    listJobs: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        jobType = [],
        location = [],
        experienceLevel = [],
      }) => ({
        url: "/jobs/applicant",
        params: {
          page,
          limit,
          search,
          ...(jobType.length > 0 && { jobType: jobType.join(",") }),
          ...(location.length > 0 && { location: location.join(",") }),
          ...(experienceLevel.length > 0 && {
            experienceLevel: experienceLevel.join(","),
          }),
        },
      }),
    }),

    // Save job for applicant
    toggleSaveJobForApplicant: builder.mutation({
      query: (jobId: string) => ({
        url: "/jobs/toggle-save-job",
        method: "POST",
        body: { jobId },
      }),
    }),

    // Get saved jobs for applicant with pagination
    getSavedJobs: builder.query({
      query: ({ page = 1, limit = 5 }) => ({
        url: "/jobs/saved",
        params: { page, limit },
      }),
    }),

    deleteSavedJob: builder.mutation<void, string>({
      query: (jobId) => ({
        url: `/jobs/unsave/${jobId}`,
        method: "DELETE",
      }),
    }),

    // Apply for job
    applyForJob: builder.mutation({
      query: ({ jobId }) => ({
        url: `/jobs/${jobId}/apply`,
        method: "POST",
      }),
    }),

    // Get job by ID for applicant
    getJobForApplicant: builder.query<Job, string>({
      query: (id) => `/jobs/applicant/${id}`,
    }),

    // Featured jobs
    getFeaturedJobs: builder.query({
      query: () => "/jobs/featured",
    }),
  }),
});

// Auto-generated hooks
export const {
  useCreateJobMutation,
  useGetEmployerJobsQuery,
  useGetJobQuery,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetApplicationsForJobQuery,
  useToggleApplicationStatusMutation,
  useListJobsQuery,
  useToggleSaveJobForApplicantMutation,
  useGetSavedJobsQuery,
  useDeleteSavedJobMutation,
  useApplyForJobMutation,
  useGetJobForApplicantQuery,
  useGetFeaturedJobsQuery,
} = jobApi;
