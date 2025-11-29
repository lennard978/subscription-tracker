import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";

export default function SubscriptionItem({ sub, onDelete }) {
  const { id, name, price, billingCycle, renewalDate, notes } = sub;
  const [showModal, setShowModal] = useState(false);
  const [currentSub, setCurrentSub] = useState(sub);
  const [justPaid, setJustPaid] = useState(false);
  const { showToast } = useToast();

  // ✅ Load "just paid" state from localStorage (persist 24h)
  useEffect(() => {
    const savedSubs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const found = savedSubs.find((s) => s.id === sub.id);
    if (found && found.lastPaid && Date.now() - found.lastPaid < 24 * 60 * 60 * 1000) {
      setJustPaid(true);
    }
  }, [sub.id]);

  // ✅ Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ Calendar badge info
  const getCalendarBadge = (dateString) => {
    if (!dateString) return { month: "--", day: "--" };
    const date = new Date(dateString);
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  };

  // ✅ Renewal status logic
  const getRenewalStatus = (dateString) => {
    if (!dateString) return { text: "", color: "", icon: "" };

    const today = new Date();
    const renewal = new Date(dateString);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0)
      return { text: `Renews in ${diffDays} day${diffDays > 1 ? "s" : ""}`, color: "text-green-500", icon: "🔔", diffDays };
    if (diffDays === 0)
      return { text: "Renews today!", color: "text-blue-500", icon: "✅", diffDays: 0 };
    return {
      text: `Expired ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`,
      color: "text-red-500",
      icon: "⚠️",
      diffDays,
    };
  };

  // ✅ Progress bar
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
        cycleDays = 30;
    }

    const startDate = new Date(renewal);
    startDate.setDate(renewal.getDate() - cycleDays);

    const totalCycleTime = renewal - startDate;
    const elapsedTime = today - startDate;
    const progress = Math.min((elapsedTime / totalCycleTime) * 100, 100);
    return progress < 0 ? 0 : progress;
  };

  const getProgressColor = (progress) => {
    if (progress < 50) return "from-green-400 to-green-600";
    if (progress < 80) return "from-yellow-400 to-yellow-600";
    return "from-red-400 to-red-600";
  };

  const { text, color, icon, diffDays } = getRenewalStatus(currentSub.renewalDate);
  const progress = getProgress(currentSub.renewalDate, currentSub.billingCycle);
  const gradient = getProgressColor(progress);
  const { month, day } = getCalendarBadge(currentSub.renewalDate);

  const getCountdownText = () => {
    if (diffDays > 0) return `💳 Next payment of €${currentSub.price} in ${diffDays} day${diffDays > 1 ? "s" : ""}`;
    if (diffDays === 0) return `✅ Payment due today (€${currentSub.price})`;
    return `⚠️ Payment missed ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? "s" : ""} ago`;
  };

  // ✅ Handle “Mark as Paid”
  const handlePaid = () => {
    const oldRenewal = new Date(currentSub.renewalDate || new Date());
    const newRenewal = new Date(oldRenewal);

    // ⏩ Move renewal date forward
    if (currentSub.billingCycle === "Weekly") newRenewal.setDate(newRenewal.getDate() + 7);
    else if (currentSub.billingCycle === "Yearly") newRenewal.setFullYear(newRenewal.getFullYear() + 1);
    else newRenewal.setMonth(newRenewal.getMonth() + 1);

    let newReminderDate = currentSub.reminderDate ? new Date(currentSub.reminderDate) : null;

    // ⏩ If reminder is enabled, shift it too
    if (currentSub.hasReminder && newReminderDate) {
      if (currentSub.billingCycle === "Weekly") newReminderDate.setDate(newReminderDate.getDate() + 7);
      else if (currentSub.billingCycle === "Yearly") newReminderDate.setFullYear(newReminderDate.getFullYear() + 1);
      else newReminderDate.setMonth(newReminderDate.getMonth() + 1);
    }

    const updatedSub = {
      ...currentSub,
      renewalDate: newRenewal.toISOString().split("T")[0],
      reminderDate: newReminderDate ? newReminderDate.toISOString().split("T")[0] : currentSub.reminderDate,
    };

    setCurrentSub(updatedSub);
    updateLocalStorage(updatedSub);

    showToast(
      `✅ Payment marked as paid. Next renewal: ${formatDate(updatedSub.renewalDate)}${updatedSub.hasReminder && updatedSub.reminderDate
        ? ` (Reminder updated to ${formatDate(updatedSub.reminderDate)})`
        : ""
      }.`,
      "success"
    );
  };

  const handleSetReminder = async (sub) => {
    try {
      if (!("Notification" in window)) {
        showToast("Notifications not supported on this device.", "error");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        showToast("Please enable notifications first.", "error");
        return;
      }

      const updatedSub = { ...sub, hasReminder: true };
      updateLocalStorage(updatedSub);
      scheduleReminder(updatedSub);

      showToast(
        `🔔 Reminder saved for ${sub.name} — 1 day before renewal.`,
        "success"
      );
    } catch (err) {
      console.error(err);
      showToast("Failed to save reminder.", "error");
    }
  };

  const scheduleReminder = async (sub) => {
    const renewalDate = new Date(sub.renewalDate);
    const reminderDate = new Date(renewalDate);
    reminderDate.setDate(renewalDate.getDate() - 1);

    const now = new Date();
    const msUntilReminder = reminderDate - now;

    if (msUntilReminder <= 0) return;

    const reg = await navigator.serviceWorker.getRegistration();

    // Save timeout id in memory (non-persistent)
    setTimeout(() => {
      if (reg && reg.showNotification) {
        reg.showNotification("💳 Subscription Reminder", {
          body: `${sub.name} renews tomorrow (€${sub.price})`,
          icon: "/subscription-tracker/icon-192.png",
        });
      } else {
        new Notification("💳 Subscription Reminder", {
          body: `${sub.name} renews tomorrow (€${sub.price})`,
        });
      }
    }, msUntilReminder);
  };

  const handleToggleReminder = async (sub) => {
    try {
      if (!("Notification" in window)) {
        showToast("Notifications not supported on this device.", "error");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        showToast("Please enable notifications first.", "error");
        return;
      }

      const updatedSub = { ...sub, hasReminder: !sub.hasReminder };
      updateLocalStorage(updatedSub);
      setCurrentSub(updatedSub);

      if (updatedSub.hasReminder) {
        scheduleReminder(updatedSub);
        showToast(`🔔 Reminder set for ${sub.name}`, "success");
      } else {
        cancelReminder(updatedSub);
        showToast(`🔕 Reminder cancelled for ${sub.name}`, "info");
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update reminder.", "error");
    }
  };

  const cancelReminder = (sub) => {
    // For now, we just remove the flag — actual scheduled setTimeout clears on reload
    const savedSubs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const updatedList = savedSubs.map((s) =>
      s.id === sub.id ? { ...s, hasReminder: false } : s
    );
    localStorage.setItem("subscriptions", JSON.stringify(updatedList));
  };



  const updateLocalStorage = (updatedSub) => {
    const savedSubs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    const updatedList = savedSubs.map((s) => (s.id === updatedSub.id ? updatedSub : s));
    localStorage.setItem("subscriptions", JSON.stringify(updatedList));
  };

  return (
    <>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm mb-3 transition-transform hover:scale-[1.01]">
        <div className="flex justify-between items-center mb-2">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <div
              onClick={() => setShowModal(true)}
              className="flex flex-col items-center justify-center w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md shadow-sm cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{month}</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">{day}</span>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-1 flex items-center gap-1">
                {currentSub.name}
                {currentSub.hasReminder && <span className="text-yellow-500">🔔</span>}
              </h2>

              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {currentSub.billingCycle} – €{currentSub.price}
              </p>

              {/* ✅ Show reminder info if exists */}
              {currentSub.hasReminder && currentSub.reminderDate && (
                <p className="text-xs text-yellow-500 mt-1">
                  ⏰ Reminds you on {new Date(currentSub.reminderDate).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              )}

              {/* ✅ Renewal status text */}
              {text && (
                <p className={`text-xs mt-1 font-medium flex items-center gap-1 ${color}`}>
                  <span>{icon}</span> {text}
                </p>
              )}
            </div>


          </div>

        </div>
        {/* Buttons */}
        <div className="flex gap-2 justify-end">

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
          <button
            onClick={() => handleToggleReminder(currentSub)}
            className={`px-3 py-1 rounded-md text-white transition-colors ${currentSub.hasReminder
              ? "bg-yellow-500 hover:bg-yellow-600"
              : "bg-gray-500 hover:bg-gray-600"
              }`}
          >
            {currentSub.hasReminder ? "🔕 Cancel Reminder" : "🔔 Set Reminder"}
          </button>
        </div>
        {/* Progress bar */}
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

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-80 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-3 text-center">{currentSub.name}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Billing Cycle:</strong> {currentSub.billingCycle}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Price:</strong> €{currentSub.price}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              <strong>Renewal Date:</strong> {formatDate(currentSub.renewalDate)}
            </p>

            {notes && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                <strong>Notes:</strong> {notes}
              </p>
            )}

            <button
              onClick={() => handleSetReminder(currentSub)}
              className="mt-1 w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              🔔 Remind me 1 day before
            </button>



            {/* ✅ Reminder Section */}
            <div className="mb-4">
              <label className="block text-sm font-medium my-2">🔔 Reminder</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={currentSub.reminderDate || ""}
                  onChange={(e) => {
                    const newReminder = e.target.value;
                    const updatedSub = {
                      ...currentSub,
                      hasReminder: !!newReminder,
                      reminderDate: newReminder,
                    };
                    setCurrentSub(updatedSub);
                    updateLocalStorage(updatedSub);
                    showToast(
                      newReminder
                        ? `📅 Reminder set for ${formatDate(newReminder)}`
                        : "🔕 Reminder removed",
                      newReminder ? "info" : "error"
                    );
                  }}
                  className="px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 text-sm w-full"
                />
              </div>
              {currentSub.hasReminder && currentSub.reminderDate && (
                <p className="text-xs text-gray-500 mt-1">
                  Reminder active for {formatDate(currentSub.reminderDate)}
                </p>
              )}
            </div>

            {/* ✅ Countdown */}
            <div className="mt-4 text-center">
              <p
                className={`text-sm font-medium ${diffDays < 0 ? "text-red-500" : "text-green-500"
                  }`}
              >
                {getCountdownText()}
              </p>
            </div>

            {/* ✅ Buttons */}
            <div className="space-y-2 mt-4">
              <button
                onClick={handlePaid}
                className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                Mark as Paid ✅
              </button>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
