import { useState } from "react";
import { Link } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import SubscriptionList from "../components/SubscriptionList";
import useRenewalNotifications from "../hooks/useRenewalNotifications";
import React from "react";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useLocalStorage("subscriptions", []);
  useRenewalNotifications(); // 👈 Auto-check upcoming renewals

  const handleDelete = (id) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Your Subscriptions</h1>
        <Link
          to="/add"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          ➕ Add Subscription
        </Link>
      </div>
      <SubscriptionList items={subscriptions} onDelete={handleDelete} />
    </div>
  );
}
