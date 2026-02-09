/**
 * Redux store – client state only (auth, UI preferences).
 * Server state lives in React Query.
 */
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
