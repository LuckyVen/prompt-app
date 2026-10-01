import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import NotFoundPage from "./pages/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

import HomePage from "./pages/prompts/HomePage";
import SmartBuilderPage from "./pages/prompts/SmartBuilderPage";
import PromptWorkspacePage from "./pages/prompts/PromptWorkspacePage";
import ImprovePromptPage from "./pages/prompts/ImprovePromptPage";
import MyPromptsPage from "./pages/prompts/MyPromptsPage";
import FavoritesPage from "./pages/prompts/FavoritesPage";

import TemplatesPage from "./pages/templates/TemplatesPage";

import ProfilePage from "./pages/account/ProfilePage";
import SettingsPage from "./pages/account/SettingsPage";

/* =========================================================
   ROUTER
========================================================= */

const router =
  createBrowserRouter([
    /* =====================================================
       MAIN APPLICATION
    ===================================================== */

    {
      element:
        <AppLayout />,

      children: [
        /* ===============================================
           PUBLIC ROUTES
        =============================================== */

        {
          path: "/",
          element:
            <HomePage />,
        },

        {
          path:
            "/templates",
          element:
            <TemplatesPage />,
        },

        /* ===============================================
           PROTECTED ROUTES
        =============================================== */

        {
          element:
            <ProtectedRoute />,

          children: [
            {
              path:
                "/prompts",
              element:
                <MyPromptsPage />,
            },

            {
              path:
                "/prompts/new",
              element:
                <SmartBuilderPage />,
            },

            {
              path:
                "/prompts/:id",
              element:
                <PromptWorkspacePage />,
            },

            {
              path:
                "/improve",
              element:
                <ImprovePromptPage />,
            },

            {
              path:
                "/favorites",
              element:
                <FavoritesPage />,
            },

            {
              path:
                "/profile",
              element:
                <ProfilePage />,
            },

            {
              path:
                "/settings",
              element:
                <SettingsPage />,
            },
          ],
        },

        /* ===============================================
           NOT FOUND
        =============================================== */

        {
          path: "*",
          element:
            <NotFoundPage />,
        },
      ],
    },

    /* =====================================================
       AUTH ROUTES
    ===================================================== */

    {
      element:
        <AuthLayout />,

      children: [
        {
          path:
            "/login",
          element:
            <LoginPage />,
        },

        {
          path:
            "/register",
          element:
            <RegisterPage />,
        },

        {
          path:
            "/forgot-password",
          element:
            <ForgotPasswordPage />,
        },

        {
          path:
            "/reset-password",
          element:
            <ResetPasswordPage />,
        },
      ],
    },
  ]);

/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <RouterProvider
      router={router}
    />
  );
}

export default App;