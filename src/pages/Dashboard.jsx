import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SubscriptionList from "../components/SubscriptionList";
import useNotifications from "../hooks/useNotifications";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const { requestPermission, scheduleReminders } = useNotifications();

  // ✅ Load subscriptions from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("subscriptions") || "[]");

    // Sort by soonest renewal date
    const sorted = [...saved].sort((a, b) => {
      if (!a.renewalDate) return 1;
      if (!b.renewalDate) return -1;
      return new Date(a.renewalDate) - new Date(b.renewalDate);
    });

    setSubscriptions(sorted);

    // Calculate total cost
    const sum = sorted.reduce((acc, sub) => acc + Number(sub.price || 0), 0);
    setTotalCost(sum);
  }, []);

  // ✅ Schedule notification reminders
  useEffect(() => {
    if (subscriptions.length > 0) {
      requestPermission().then((granted) => {
        if (granted) scheduleReminders(subscriptions);
      });
    }
  }, [subscriptions]);

  // ✅ Delete subscription handler
  const handleDelete = (id) => {
    const updated = subscriptions.filter((sub) => sub.id !== id);
    setSubscriptions(updated);
    localStorage.setItem("subscriptions", JSON.stringify(updated));
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Add new subscription button */}
      <div className="flex  justify-center mb-4">
        <Link
          to="/add"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          + Add Subscription
        </Link>
      </div>
      {/* ✅ Header with total cost */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Subscriptions</h1>
        <p className="text-gray-700 dark:text-gray-300 font-medium">
          💶 Total: € {totalCost.toFixed(2)}
        </p>
      </div>



      <SubscriptionList items={subscriptions} onDelete={handleDelete} />
    </div>
  );
}
