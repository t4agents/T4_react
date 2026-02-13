// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { lazy } from 'react';
import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* =========================
   Auth Logic (REPLACE THIS)
========================= */
const isAuthenticated = (): boolean => {
  // TODO: replace with real auth logic (context / redux / token check)
  return !!localStorage.getItem('access_token');
};

/* =========================
   Route Guards
========================= */
const ProtectedRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/auth/auth2/login" replace />;
};

const PublicRoute = () => {
  return !isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

/* =========================
   Layouts
========================= */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* =========================
   Auth Pages
========================= */
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register')));
const Maintainance = Loadable(lazy(() => import('../views/authentication/Maintainance')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

/* =========================
   Dashboard
========================= */
const Modern = Loadable(lazy(() => import('../views/dashboards/Modern')));

/* =========================
   Pages
========================= */
const UserProfile = Loadable(lazy(() => import('../views/pages/user-profile/UserProfile')));

/* =========================
   Apps
========================= */
const Notes = Loadable(lazy(() => import('../views/apps/notes/Notes')));
const Form = Loadable(lazy(() => import('../views/utilities/form/Form')));
const Table = Loadable(lazy(() => import('../views/utilities/table/Table')));
const Tickets = Loadable(lazy(() => import('../views/apps/tickets/Tickets')));
const CreateTickets = Loadable(lazy(() => import('../views/apps/tickets/CreateTickets')));
const Blog = Loadable(lazy(() => import('../views/apps/blog/Blog')));
const BlogDetail = Loadable(lazy(() => import('../views/apps/blog/BlogDetail')));
const SolarIcon = Loadable(lazy(() => import('../views/icons/SolarIcon')));

/* =========================
   Router Config
========================= */
const router = createBrowserRouter([
  // PROTECTED APP ROUTES
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <FullLayout />,
        children: [
          { index: true, element: <Modern /> },

          { path: 'apps/notes', element: <Notes /> },
          { path: 'utilities/form', element: <Form /> },
          { path: 'utilities/table', element: <Table /> },
          { path: 'apps/tickets', element: <Tickets /> },
          { path: 'apps/tickets/create', element: <CreateTickets /> },
          { path: 'apps/blog/post', element: <Blog /> },
          { path: 'apps/blog/detail/:id', element: <BlogDetail /> },
          { path: 'user-profile', element: <UserProfile /> },
          { path: 'icons/iconify', element: <SolarIcon /> },
        ],
      },
    ],
  },

  // PUBLIC AUTH ROUTES
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/',
        element: <BlankLayout />,
        children: [
          { path: 'auth/auth2/login', element: <Login2 /> },
          { path: 'auth/auth2/register', element: <Register2 /> },
        ],
      },
    ],
  },

  // SYSTEM ROUTES (NO GUARD)
  {
    path: '/auth/maintenance',
    element: <BlankLayout />,
    children: [{ index: true, element: <Maintainance /> }],
  },
  {
    path: '/auth/404',
    element: <BlankLayout />,
    children: [{ index: true, element: <Error /> }],
  },

  // FALLBACK
  {
    path: '*',
    element: <Navigate to="/auth/404" replace />,
  },
]);

export default router;