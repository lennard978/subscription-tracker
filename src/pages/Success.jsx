import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Success() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast("Payment successful!", "success");
  }, []);

  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
        <h1 className="text-2xl font-semibold mb-4">Thank You!</h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your payment was successful. Your subscription is now active.
        </p>

        <Link
          to="/dashboard"
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
