import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function SubscriptionItem({ sub, onDelete }) {
  const { id, name, price, billingCycle, renewalDate, notes } = sub;
  const [showModal, setShowModal] = useState(false);

  // ✅ Format date (e.g., "Thursday, November 20, 2025")
  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Calendar badge (Month + Day)
  const getCalendarBadge = (dateString) => {
    if (!dateString) return { month: "--", day: "--" };
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  // ✅ Renewal status (emoji, color, text)
  const getRenewalStatus = (dateString) => {
    if (!dateString) return { text: "", color: "", icon: "" };

    const today = new Date();
    const renewal = new Date(dateString);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return {
        text: `Renews in ${diffDays} day${diffDays > 1 ? "s" : ""}`,
        color: "text-green-500",
        icon: "🔔",
      };
    }
    if (diffDays === 0) {
      return {
        text: "Renews today!",
        color: "text-blue-500",
        icon: "✅",
      };
    }
    return {
      text: `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`,
      color: "text-red-500",
      icon: "⚠️",
    };
  };

  // ✅ Billing cycle progress calculation
  const getProgress = (dateString, cycle) => {
    if (!dateString) return 0;

    const renewal = new Date(dateString);
    const today = new Date();

    let cycleDays;
    switch (cycle) {
      case "Weekly":
        cycleDays = 7;
        break;
      case "Yearly":
        cycleDays = 365;
        break;
      default:
        cycleDays = 30; // Monthly default
    }

    const startDate = new Date(renewal);
    startDate.setDate(renewal.getDate() - cycleDays);

    const totalCycleTime = renewal - startDate;
    const elapsedTime = today - startDate;
    const progress = Math.min((elapsedTime / totalCycleTime) * 100, 100);
    return progress < 0 ? 0 : progress;
  };

  // ✅ Dynamic gradient color
  const getProgressColor = (progress) => {
    if (progress < 50) return "from-green-400 to-green-600";
    if (progress < 80) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const { text, color, icon } = getRenewalStatus(renewalDate);
  const progress = getProgress(renewalDate, billingCycle);
  const gradient = getProgressColor(progress);
  const { month, day } = getCalendarBadge(renewalDate);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm mb-3 transition-transform hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-2">
          {/* ✅ Left section with calendar badge and details */}
          <div className="flex items-center gap-4">
            {/* Clickable calendar badge */}
            <div
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md shadow-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {month}
              </span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {day}
              </span>
            </div>

            {/* Subscription details */}
            <div>
              <h2 className="font-semibold text-lg mb-1">{name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {billingCycle} : €{price}
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Comments : {notes ? notes : "No comments added"}
              </p>

              {/* Status with emoji */}
              {text && (
                <p
                  className={`text-xs mt-1 font-medium flex items-center gap-1 ${color}`}
                >
                  <span>{icon}</span> {text}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
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

        {/* ✅ Progress bar */}
        <div className="mt-2">
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradient} transition-all duration-700`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(progress)}% of billing cycle passed
          </p>
        </div>
      </div>

      {/* ✅ Modal Popup */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-3 text-center">{name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Billing Cycle:</strong> {billingCycle}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Price:</strong> €{price}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Renewal Date:</strong> {formatDate(renewalDate)}
            </p>
            {notes && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <strong>Notes:</strong> {notes}
              </p>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
