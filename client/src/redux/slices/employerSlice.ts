import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Employer } from "../../types/employerTypes";

interface EmployerState {
  employer: Employer | null;
  accessToken: string | null;
  role: string | null;
}

const initialState: EmployerState = {
  employer: null,
  accessToken: null,
  role: null,
};

const employerSlice = createSlice({
  name: "employer",
  initialState,
  reducers: {
    setEmployerCredentials: (
      state,
      action: PayloadAction<{
        employer: Employer;
        accessToken: string;
        role: string;
      }>
    ) => {
      state.employer = action.payload.employer;
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.employer = null;
      state.accessToken = null;
      state.role = null;
    },
    updateEmployer: (state, action: PayloadAction<Employer>) => {
      state.employer = action.payload;
    },
  },
});

export const { setEmployerCredentials, logout, updateEmployer } =
  employerSlice.actions;
export default employerSlice.reducer;
