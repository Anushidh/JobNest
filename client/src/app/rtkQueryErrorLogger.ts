import { isRejectedWithValue, Middleware } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
  if (isRejectedWithValue(action)) {
    const payload = action.payload as {
      status?: number;
      data?: { 
        error?: string;  // Matches your backend format
        message?: string // Fallback for other APIs
      };
    };

    const errorMessage = 
      payload.data?.error ||    // Your actual format ("Invalid email or password")
      payload.data?.message ||  // Alternative format
      'Request failed';
    
    toast.error(errorMessage);
  }
  return next(action);
};