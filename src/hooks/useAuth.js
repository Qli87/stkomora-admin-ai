/**
 * Auth: Redux selectors + login mutation (API + Redux).
 * Login calls API, then stores token in localStorage and Redux.
 */
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../core/api/auth';
import { setCredentials, setLoginError, logout } from '../core/store/slices/authSlice';
import { routes } from '../core/constants/routes';

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = !!token;

  const loginMutation = useMutation({
    mutationFn: (credentials) => authApi.login(credentials),
    onMutate: () => {
      dispatch(setLoginError(null));
    },
    onSuccess: (response) => {
      const token = response.data?.token;
      const user = response.data;
      if (token) {
        localStorage.setItem('token', token);
        dispatch(setCredentials({ user, token }));
        navigate(routes.home, { replace: true });
      } else {
        dispatch(setLoginError('Unexpected login response'));
      }
    },
    onError: (err) => {
      const message =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        'Greška pri prijavi';
      dispatch(setLoginError(message));
    },
  });

  const doLogout = () => {
    localStorage.removeItem('token');
    dispatch(logout());
    navigate(routes.login, { replace: true });
  };

  return {
    user,
    token,
    error,
    isAuthenticated,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isPending,
    loginError: error,
    logout: doLogout,
  };
}
