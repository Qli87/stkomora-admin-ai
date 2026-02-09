/**
 * App root – Router v6, React Query, Redux.
 * Public: /login. Protected: layout with sidebar, members, news, etc.
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './core/store';
import { PrivateRoute } from './components/PrivateRoute';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import MemberListPage from './pages/members/MemberListPage';
import NewsListPage from './pages/news/NewsListPage';
import AdvListPage from './pages/advertisments/AdvListPage';
import CongressListPage from './pages/congress/CongressListPage';
import LicenseListPage from './pages/licenses/LicenseListPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import ConsultantListPage from './pages/consultants/ConsultantListPage';
import PlaceholderPage from './pages/PlaceholderPage';
import NotFoundPage from './pages/NotFoundPage';
import { routes } from './core/constants/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>
          <BrowserRouter>
            <Routes>
              <Route path={routes.login} element={<LoginPage />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <AppLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to={routes.home} replace />} />
                <Route path="pocetna" element={<HomePage />} />
                <Route path="spisakClanova" element={<MemberListPage />} />
                <Route path="licence" element={<LicenseListPage />} />
                <Route path="zaposleni" element={<EmployeeListPage />} />
                <Route path="saradnici" element={<ConsultantListPage />} />
                <Route path="kontakt" element={<PlaceholderPage title="Kontakt" />} />
                <Route path="vijesti" element={<NewsListPage />} />
                <Route path="vijestiKategorije/:id" element={<PlaceholderPage title="Vijesti po kategoriji" />} />
                <Route path="clanoviSkupstinePg" element={<PlaceholderPage title="Skupština PG" />} />
                <Route path="clanoviSkupstineNk" element={<PlaceholderPage title="Skupština NK" />} />
                <Route path="clanoviSkupstineCt" element={<PlaceholderPage title="Skupština CT" />} />
                <Route path="clanoviSkupstineSjever" element={<PlaceholderPage title="Skupština Sjever" />} />
                <Route path="clanoviSkupstineJug" element={<PlaceholderPage title="Skupština Jug" />} />
                <Route path="oglasi" element={<AdvListPage />} />
                <Route path="onama" element={<PlaceholderPage title="O nama" />} />
                <Route path="kongres" element={<CongressListPage />} />
                <Route path="organi_komore" element={<PlaceholderPage title="Organi komore" />} />
                <Route path="pristup_informacijama" element={<PlaceholderPage title="Pristup informacijama" />} />
                <Route path="dodaj_o_komori" element={<PlaceholderPage title="Dodaj o komori" />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App;
