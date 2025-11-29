import React, { useEffect, useState } from "react";
import useNotifications from "../hooks/useNotifications";
import { useToast } from "../context/ToastContext";

export default function NotificationButton() {
  const { requestPermission, isSupported } = useNotifications();
  const [permission, setPermission] = useState(Notification.permission);
  const { showToast } = useToast();

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const handleClick = async () => {
    if (!isSupported) {
      showToast("Notifications not supported on this device.", "error");
      return;
    }
    const granted = await requestPermission();
    setPermission(Notification.permission);

    if (granted) {
      showToast("🔔 Notifications enabled!", "success");
    } else {
      showToast("⚠️ Notifications not granted.", "error");
    }
  };

  const buttonStyle =
    permission === "granted"
      ? "bg-blue-700 text-white hover:bg-blue-600 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 px-4 py-2 rounded"
      : "bg-blue-500 hover:bg-blue-600";

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-2 text-sm rounded-md text-white transition-colors ${buttonStyle}`}
    >
      {permission === "granted" ? "✅ Enabled" : "🔔 Enable"}
    </button>
  );
}
