import { configureStore } from "@reduxjs/toolkit";

import authslice from "./slices/authSlice";
import viewPolicySlice from "./slices/policySlice";
import deleteModalSlice from "./slices/deletemodalSlice";

export const store = configureStore({
    reducer:{
        auth: authslice,
        viewPolicy: viewPolicySlice,
        deleteModal: deleteModalSlice
    }
})
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;