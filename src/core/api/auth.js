/**
 * Auth API – login (no token in request).
 * Token is stored in localStorage and Redux by the caller.
 */
import apiClient from './client';

export const authApi = {
  login: (credentials) =>
    apiClient.post('/api/auth/login', {
      email: credentials.email,
      password: credentials.password,
    }),
};
