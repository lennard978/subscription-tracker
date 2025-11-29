// src/hooks/useNotifications.js
export default function useNotifications() {
  const requestPermission = async () => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support notifications.");
      return false;
    }

    const permission = await Notification.requestPermission();
    console.log("🔔 Notifications permission:", permission);
    return permission === "granted";
  };

  const notify = (title, options) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };

  // ✅ Schedule reminders for upcoming renewals
  const scheduleReminders = (subscriptions) => {
    if (!("Notification" in window)) return;

    const today = new Date();

    subscriptions.forEach((sub) => {
      if (!sub.renewalDate) return;

      const renewalDate = new Date(sub.renewalDate);
      const diffDays = Math.ceil(
        (renewalDate - today) / (1000 * 60 * 60 * 24)
      );

      // 🔔 Show notification if renewal is tomorrow
      if (diffDays === 1) {
        notify("🔔 Upcoming Renewal", {
          body: `${sub.name} renews tomorrow (€${sub.price})`,
          icon: "/subscription-tracker/icons/icon-192x192.png",
        });
      }
    });
  };

  return { requestPermission, notify, scheduleReminders };
}
