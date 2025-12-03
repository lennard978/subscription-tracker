import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../context/ToastContext";
import { useTranslation } from "react-i18next";    // ← ADD THIS

export default function Settings() {
  const { user, logout, trialStart, isTrialExpired } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/");
  };

  const getTrialInfo = () => {
    if (!trialStart) return "Trial not started";

    const start = new Date(trialStart);
    const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
    return isTrialExpired
      ? `Trial expired on: ${end.toDateString()}`
      : `Trial ends on: ${end.toDateString()}`;
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <div className="space-y-4">
        {/* ACCOUNT INFO */}
        <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-2">Account</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Email: <span className="font-semibold">{user?.email}</span>
          </p>
        </div>

        {/* TRIAL INFO */}
        <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-2">Trial Status</h2>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {getTrialInfo()}
          </p>
        </div>

        {/* PLACEHOLDER FOR SUBSCRIPTION DATA — FUTURE BACKEND INTEGRATION */}
        <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-2">Premium Subscription</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Not subscribed yet.
          </p>
          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            Stripe subscription data will appear here once backend integration is implemented.
          </p>
        </div>

        {/* NOTIFICATION SETTINGS */}
        <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-lg font-medium mb-2">Notifications</h2>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={async () => {
              const permission = await Notification.requestPermission();
              if (permission === "granted") {
                showToast("Notifications enabled", "success");
              } else {
                showToast("Notifications blocked", "error");
              }
            }}
          >
            Enable Notifications
          </button>

          <p className="text-xs mt-2 text-gray-500 dark:text-gray-400">
            Required to notify you before subscription renewals.
          </p>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          className="w-full py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
