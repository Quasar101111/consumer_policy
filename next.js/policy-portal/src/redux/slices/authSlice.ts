
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
 interface AuthState{
    user: string | null;
    isAuthenticated: boolean;
 }
 const initialState: AuthState={
    isAuthenticated: false,
    user: null,
 }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action:PayloadAction<{user: string}>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
