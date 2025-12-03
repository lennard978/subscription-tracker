import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function Cancel() {
  const { showToast } = useToast();

  useEffect(() => {
    showToast("Payment canceled", "error");
  }, []);

  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
        <h1 className="text-2xl font-semibold mb-4">Payment Canceled</h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Your payment was not completed. You can try again any time.
        </p>

        <Link
          to="/settings"
          className="px-6 py-2 bg-gray-300 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Back to Settings
        </Link>
      </div>
    </div>
  );
}
