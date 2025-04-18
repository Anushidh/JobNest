import { IService } from "../../pages/service/Services";
import { baseApi } from "../baseApi";

export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProviderServices: builder.query<IService[], void>({
      query: () => "/services/provider",
    }),
    getServiceById: builder.query({
      query: (id) => `/services/${id}`,
    }),
    createService: builder.mutation({
      query: (service) => ({
        url: "/services/",
        method: "POST",
        body: service,
      }),
    }),
    updateService: builder.mutation({
      query: ({ id, ...service }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body: service,
      }),
    }),
    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
    }),
    toggleServiceStatus: builder.mutation({
      query: (id) => ({
        url: `/services/${id}/toggle-status`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useGetProviderServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useToggleServiceStatusMutation,
} = serviceApi;
