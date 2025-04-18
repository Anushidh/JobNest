import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Applicant } from "../../types/applicantTypes";

interface applicantState {
  applicant: Applicant | null;
  accessToken: string | null;
  role: string | null;
}

const initialState: applicantState = {
  applicant: null,
  accessToken: null,
  role: null,
};

const applicantSlice = createSlice({
  name: "applicant",
  initialState,
  reducers: {
    setApplicantCredentials: (
      state,
      action: PayloadAction<{
        applicant: Applicant;
        accessToken: string;
        role: string;
      }>
    ) => {
      state.applicant = action.payload.applicant;
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.applicant = null;
      state.accessToken = null;
      state.role = null;
    },
    updateApplicant: (state, action: PayloadAction<Applicant>) => {
      state.applicant = action.payload;
    },
  },
});

export const { setApplicantCredentials, logout, updateApplicant } =
  applicantSlice.actions;
export default applicantSlice.reducer;
