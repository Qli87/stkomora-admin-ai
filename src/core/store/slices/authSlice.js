/**
 * Auth slice – client-only state: user, token, login error.
 * Server calls (login) are done via React Query / API; this slice only stores result.
 */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  token: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user = payload?.user ?? payload;
      state.token = payload?.token ?? null;
      state.error = null;
    },
    setLoginError: (state, { payload }) => {
      state.error = payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
});

export const { setCredentials, setLoginError, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectAuth = (state) => state.auth;
export const selectToken = (state) => state.auth.token;
export const selectUser = (state) => state.auth.user;
export const selectLoginError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;
