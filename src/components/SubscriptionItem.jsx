import { Link } from "react-router-dom";
import React from "react";

export default function SubscriptionItem({ sub, onDelete }) {
  const { id, name, price, billingCycle, renewalDate, notes } = sub;

  // ✅ Format the date (e.g., "Thursday, November 20, 2025")
  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Optional: show color if expired or upcoming
  const isExpired = renewalDate && new Date(renewalDate) < new Date();
  const renewalColor = isExpired ? "text-red-500" : "text-green-500";

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm mb-3">
      <div>
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {billingCycle} – €{price}
        </p>

        {/* ✅ Formatted & colored renewal date */}
        <p className={`text-sm ${renewalColor}`}>
          Renews on – {formatDate(renewalDate)}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Comments – {notes || "No comments"}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Link
          to={`/edit/${id}`}
          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(id)}
          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
