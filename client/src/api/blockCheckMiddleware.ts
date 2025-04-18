// import { logout as userLogout } from "../redux/slices/userAuthSlice.ts";
// import { logout as serviceProviderLogout } from "../redux/slices/serviceProviderAuthSlice.ts";

// export const createBlockCheckMiddleware = () => {
//   return (store: any) => (next: any) => async (action: any) => {
//     // Check if the action contains an API response indicating blocked status
//     if (
//       action?.error?.response?.status === 403 &&
//       action?.error?.response?.data?.message === "Blocked by Admin"
//     ) {
//       const state = store.getState();

//       if (state.user.isUserSignedIn) {
//         store.dispatch(userLogout());
//       } else if (state.serviceProvider.isServiceProviderSignIn) {
//         store.dispatch(serviceProviderLogout());
//       }
//     }
//     return next(action);
//   };
// };
