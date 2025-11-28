import React, { useEffect, useState } from "react";
import useNotifications from "../hooks/useNotifications";
import { useToast } from "../context/ToastContext";

export default function NotificationButton() {
  const { requestPermission } = useNotifications();
  const { showToast } = useToast();
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    // Keep track of current notification permission
    setPermission(Notification.permission);
  }, []);

  const handleClick = async () => {
    try {
      if (permission === "granted") {
        showToast("✅ Notifications are already enabled!", "info");
        return;
      }

      const result = await requestPermission();
      setPermission(result);

      if (result === "granted") {
        showToast("🔔 Notifications enabled successfully!", "success");
      } else if (result === "denied") {
        showToast("🚫 Notifications permission denied.", "error");
      } else {
        showToast("ℹ️ Notification permission dismissed or unavailable.", "info");
      }
    } catch (err) {
      console.error("Notification error:", err);
      showToast("⚠️ Failed to request notification permission.", "error");
    }
  };

  // Dynamic button color
  const getButtonStyle = () => {
    switch (permission) {
      case "granted":
        return "bg-green-500 hover:bg-green-600";
      case "denied":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  // Dynamic button text
  const getButtonText = () => {
    switch (permission) {
      case "granted":
        return "✅ Notifications On";
      case "denied":
        return "🚫 Blocked";
      default:
        return "🔔 Enable Notifications";
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-2 text-sm text-white rounded-md transition-colors ${getButtonStyle()}`}
    >
      {getButtonText()}
    </button>
  );
}
