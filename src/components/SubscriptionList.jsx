import SubscriptionItem from "./SubscriptionItem";
import React from "react";

export default function SubscriptionList({ items, onDelete }) {
  if (!items.length) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">
        No subscriptions added yet .
      </p>
    );
  }

  return (
    <div>
      {items.map((sub) => (
        <SubscriptionItem key={sub.id} sub={sub} onDelete={onDelete} />
      ))}
    </div>
  );
}
