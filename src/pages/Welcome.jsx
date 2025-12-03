import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";

export default function Welcome() {
  const { user } = useAuth();
  const { t } = useTranslation();

  if (user) {
    return (
      <div className="text-center mt-20 text-gray-200">
        <p className="mb-4">You are already signed in.</p>
        <Link
          to="/dashboard"
          className="text-blue-500 underline hover:text-blue-400"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-16">
      <div className="max-w-lg w-full p-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-xl">
        <h1 className="text-3xl font-bold mb-4 text-center tracking-tight">
          {t("welcome_title")}
        </h1>

        <p className="text-center text-base opacity-90 mb-8 leading-relaxed">
          {t("welcome_message")}
        </p>

        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="px-6 py-2 bg-white text-blue-600 font-medium rounded-md hover:bg-gray-100 transition"
          >
            {t("button_sign_in")}
          </Link>

          <Link
            to="/signup"
            className="px-6 py-2 border border-white text-white font-medium rounded-md hover:bg-white hover:text-blue-600 transition"
          >
            {t("button_sign_up")}
          </Link>
        </div>
      </div>
    </div>
  );
}
