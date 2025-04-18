import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";

import {
  logout as adminLogout,
  setAdminCredentials,
} from "../redux/slices/adminSlice.ts";
import {
  logout as employerLogout,
  setEmployerCredentials,
} from "../redux/slices/employerSlice.ts";
import {
  logout as userLogout,
  setApplicantCredentials,
} from "../redux/slices/applicantSlice.ts";

const base_url = import.meta.env.VITE_BASE_URL;
// Create a mutex to prevent multiple refresh requests
const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: base_url,
  credentials: "include", // Ensures cookies (refresh token) are sent
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as any;
    // Get token based on which user is logged in
    const token =
      state.admin?.accessToken ||
      state.employer?.accessToken ||
      state.applicant?.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  console.log("inside baseQueryWithReauth");
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("401 error");
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as any;
        const role =
          state.admin?.role || state.employer?.role || state.applicant?.role;
        console.log("role", role);
        const refreshResult = await baseQuery(
          `${base_url}/${role}/refresh`,
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const { user, accessToken, role } = refreshResult.data;

          // Set correct state based on role
          if (role === "admin") {
            api.dispatch(
              setAdminCredentials({ admin: user, accessToken, role })
            );
          } else if (role === "employer") {
            api.dispatch(
              setEmployerCredentials({
                employer: user,
                accessToken,
                role,
              })
            );
          } else {
            api.dispatch(
              setApplicantCredentials({ applicant: user, accessToken, role })
            );
          }

          result = await baseQuery(args, api, extraOptions);
        } else {
          // Log out based on role
          if (role === "admin") api.dispatch(adminLogout());
          else if (role === "employer") api.dispatch(employerLogout());
          else api.dispatch(userLogout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
