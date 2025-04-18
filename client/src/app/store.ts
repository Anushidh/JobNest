import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { setupListeners } from "@reduxjs/toolkit/query";

import adminSlice from "../redux/slices/adminSlice.ts";
import employerSlice from "../redux/slices/employerSlice.ts";
import applicantSlice from "../redux/slices/applicantSlice.ts";
import { baseApi } from "../api/baseApi";
import { rtkQueryErrorLogger } from "./rtkQueryErrorLogger.ts";

// Persist Configurations
const persistConfigAdmin = {
  key: "admin",
  storage,
};

const persistConfigEmployer = {
  key: "employer",
  storage,
};

const persistConfigApplicant = {
  key: "applicant",
  storage,
};

// Persisted Reducers
const persistedAdminReducer = persistReducer(persistConfigAdmin, adminSlice);
const persistedEmployerReducer = persistReducer(
  persistConfigEmployer,
  employerSlice
);
const persistedApplicantReducer = persistReducer(
  persistConfigApplicant,
  applicantSlice
);

// Store Configuration
export const store = configureStore({
  reducer: {
    admin: persistedAdminReducer,
    employer: persistedEmployerReducer,
    applicant: persistedApplicantReducer,
    // Add only the baseApi reducer - it handles all injected endpoints
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types to avoid serialization errors with Redux Persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat([baseApi.middleware, rtkQueryErrorLogger]),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);
// TypeScript Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
