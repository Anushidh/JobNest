import { baseApi } from "../baseApi";

export const planApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployerPlans: builder.query<any, void>({
      query: () => "/plans/employer",
    }),
  }),
});

export const { useGetAllEmployerPlansQuery } = planApi;
