import React from "react";
import { useNavigate } from "react-router-dom";

export default function SubscriptionItem({ item, onDelete }) {
  const navigate = useNavigate();

  const monthlyCost =
    item.frequency === "monthly"
      ? item.price
      : item.price / 12;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow-sm rounded-md flex items-center justify-between border border-gray-200 dark:border-gray-700">
      <div>
        <div className="font-semibold text-gray-900 dark:text-gray-100">
          {item.name}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {item.frequency === "monthly"
            ? `€${item.price.toFixed(2)} / month`
            : `€${item.price.toFixed(2)} / year`}

          <span className="ml-2 text-gray-500 dark:text-gray-400">
            (≈ €{monthlyCost.toFixed(2)} monthly)
          </span>
        </div>
      </div>
      <div className="font-semibold text-gray-900 dark:text-gray-100">
        {item.name}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        Category: <span className="font-medium">{item.category || "Other"}</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/edit/${item.id}`)}
          className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
