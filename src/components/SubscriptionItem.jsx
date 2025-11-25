import { Link } from "react-router-dom";
import React from "react";

export default function SubscriptionItem({ sub, onDelete }) {
  const { id, name, price, billingCycle, renewalDate } = sub;

  return (
    <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm mb-3">
      <div>
        <h2 className="font-semibold text-lg">{name}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {billingCycle} • €{price} • Renews on {renewalDate}
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
