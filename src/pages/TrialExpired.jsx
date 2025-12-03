import React from "react";
import { Link } from "react-router-dom";

export default function TrialExpired() {
  return (
    <div className="flex justify-center mt-16 px-4">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Your Trial Has Ended
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          Your 7-day free trial period has expired.
          To continue using Subscription Tracker, please upgrade to a premium plan.
        </p>

        {/* Placeholder button for future Stripe integration */}
        <button
          className="w-full py-2 mb-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => {
            // Later: replace with Stripe Checkout redirect
            alert("Stripe integration coming soon.");
          }}
        >
          Upgrade Now
        </button>

        <Link
          to="/settings"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Go to Settings
        </Link>
      </div>
    </div>
  );
}
