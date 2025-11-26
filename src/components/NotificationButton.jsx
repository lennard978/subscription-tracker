import useNotifications from "../hooks/useNotifications";
import React from "react";

export default function NotificationButton() {
  const { requestPermission } = useNotifications();
  return (
    <button
      onClick={requestPermission}
      className="px-3 py-2 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
    >
      🔔 Enable Notifications
    </button>
  );
}
