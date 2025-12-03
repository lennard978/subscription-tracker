import React from "react";
import { Routes, Route, Link, Navigate, useLocation } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import AddEditSubscription from "./pages/AddEditSubscription";
import Settings from "./pages/Settings";
import DarkModeToggle from "./components/DarkModeToggle";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import TrialExpired from "./pages/TrialExpired";
import Welcome from "./pages/Welcome";
import { useAuth } from "./hooks/useAuth";
// import { Analytics } from "@vercel/analytics/react";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";

function ProtectedRoute({ children }) {
  const { user, isTrialExpired } = useAuth();
  const location = useLocation();

  if (!user) {
    // not logged in → go to welcome/login
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (isTrialExpired && !location.pathname.startsWith("/settings")) {
    // trial over → force to trial page (except settings, where user might manage subscription)
    return <Navigate to="/trial-expired" replace />;
  }

  return children;
}

export default function App() {
  const { user } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <span className="font-bold text-lg tracking-tight">
              {t("app_name")}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <DarkModeToggle />

            {user ? (
              <Link
                to="/settings"
                className="text-sm px-3 py-1 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {t("button_settings")}
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-sm px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                {t("button_log_in")}
              </Link>
            )}
          </div>

        </div>
      </header>


      {/* Main content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />

          {/* Stripe return pages (public but assume they will affect auth/subscription state) */}
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          {/* Trial expired info page */}
          <Route path="/trial-expired" element={<TrialExpired />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddEditSubscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <AddEditSubscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Vercel Analytics */}
        {/* <Analytics /> */}
      </main>

      <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80">
        <div className="max-w-4xl mx-auto px-4 py-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>© {new Date().getFullYear()} Subscription Tracker</span>
          <span>Privacy-first · PWA · Offline capable</span>
        </div>
      </footer>
    </div>
  );
}
