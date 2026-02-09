# Architecture – Modernized Stack

This document describes the new architecture after the React/Redux/React Query/Ant Design migration.

## Stack

- **React 18** – functional components, hooks
- **Redux (Redux Toolkit)** – client-only state (auth: user, token, login error)
- **React Query (TanStack Query)** – server/API state (members, news, etc.)
- **Axios** – HTTP client (central `apiClient` with auth interceptors)
- **Ant Design** – UI (Layout, Form, Table, Modal, etc.)
- **React Router v6** – routing

## Folder Structure

```
src/
├── core/
│   ├── api/
│   │   ├── client.js       # Axios instance + interceptors
│   │   ├── members.js      # Members & cities API
│   │   └── auth.js         # Login API
│   ├── store/
│   │   ├── index.js        # configureStore (auth only)
│   │   └── slices/
│   │       └── authSlice.js
│   └── constants/
│       └── routes.js       # Route paths
├── hooks/
│   ├── useMembers.js       # React Query: useMembers, useMember, useAddMember, useUpdateMember, useDeleteMember, useCities
│   └── useAuth.js          # Redux selectors + login mutation (API + Redux)
├── components/
│   ├── PrivateRoute.js     # Redirect to /login if no token
│   └── layout/
│       └── AppLayout.js    # Ant Design Layout + Sider + sidebar menu
├── pages/
│   ├── LoginPage.js
│   ├── HomePage.js
│   ├── NotFoundPage.js
│   ├── PlaceholderPage.js  # For routes not yet migrated
│   └── members/
│       ├── MemberListPage.js
│       ├── MemberAddPage.js
│       └── MemberEditPage.js
├── App.js                  # Router, QueryClientProvider, Redux Provider, ConfigProvider, Routes
└── index.js                # createRoot, render <App />
```

## State Separation

- **Server state** (data from API): React Query  
  - Members list, member by id, cities, login request/response.  
  - Use `useMembers()`, `useMember(id)`, `useAddMember()`, etc.  
  - Cache and refetch are handled by React Query.

- **Client state** (UI/app): Redux  
  - Auth: `user`, `token`, `error` after login.  
  - Token is also stored in `localStorage`; Redux is the source of truth in memory.  
  - Use `useAuth()` or `useSelector(selectAuth)`.

## API Layer

- `core/api/client.js`: single Axios instance, base URL, request interceptor (Bearer token from `localStorage`), response interceptor (401 → clear token and redirect to `/login`).
- `core/api/members.js`, `core/api/auth.js`: plain functions that call `apiClient.get/post/put/delete`. No Redux, no sagas.

## Migrating More Domains (e.g. News, Contact)

1. **API**: Add `core/api/news.js` (or similar) with functions that use `apiClient`.
2. **React Query**: Add `hooks/useNews.js` with `useQuery`/`useMutation` and appropriate query keys.
3. **Pages**: Add pages under `pages/news/` (or reuse `PlaceholderPage` until ready) and wire routes in `App.js`.
4. **Redux**: Only add a new slice if you need global client state for that domain (e.g. UI preferences). Server data stays in React Query.

## Legacy Code (Deprecated)

- `store.js` – replaced by `core/store/index.js`.
- `saga/` – removed; side effects are in React Query mutations and API layer.
- `reducers/` (member, login, etc.) – server state moved to React Query; auth lives in `core/store/slices/authSlice.js`.
- `actions/`, `constants/` for member/login – replaced by Redux Toolkit slice and React Query hooks.
- Old `containers/` and class components under `components/` for members/login – replaced by `pages/` and hooks.

You can delete the legacy files once all routes are migrated and you no longer need the old entry (e.g. old `PageRouting.js`).

## Build Note

If `npm run build` fails with `Cannot find module 'ajv/dist/compile/codegen'`, it is a known react-scripts/ajv peer dependency issue. Try:

```bash
npm install ajv@8 --save-dev --legacy-peer-deps
```

Then run `npm run build` again.
