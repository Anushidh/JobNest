import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Admin } from "../../types/adminTypes";

interface AdminState {
  admin: Admin | null;
  accessToken: string | null;
  role: string | null;
}

const initialState: AdminState = {
  admin: null,
  accessToken: null,
  role: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminCredentials: (
      state,
      action: PayloadAction<{ admin: Admin; accessToken: string; role: string }>
    ) => {
      state.admin = action.payload.admin;
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
    },
    logout: (state) => {
      state.admin = null;
      state.accessToken = null;
      state.role = null;
    },
  },
});

export const { setAdminCredentials, logout } = adminSlice.actions;
export default adminSlice.reducer;
