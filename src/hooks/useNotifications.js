export default function useNotifications() {
  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch (err) {
      console.error("Notification permission error:", err);
      return false;
    }
  };

  const notify = (title, options) => {
    if (Notification.permission === "granted") {
      try {
        new Notification(title, options);
      } catch (err) {
        console.warn("Notification error:", err);
      }
    }
  };

  const scheduleReminders = (subscriptions) => {
    if (Notification.permission !== "granted") return;

    subscriptions.forEach((sub) => {
      if (!sub.renewalDate) return;

      const renewal = new Date(sub.renewalDate);
      const now = new Date();

      // Reminder 1 day before renewal
      const reminderTime = new Date(renewal);
      reminderTime.setDate(reminderTime.getDate() - 1);

      const msUntilReminder = reminderTime.getTime() - now.getTime();
      if (msUntilReminder > 0) {
        setTimeout(() => {
          notify(`💳 ${sub.name} renews soon!`, {
            body: `Your ${sub.billingCycle.toLowerCase()} payment of €${sub.price} is due tomorrow.`,
            icon: "/subscription-tracker/icons/icon-192x192.png",
          });
        }, msUntilReminder);
      }
    });
  };

  return { requestPermission, notify, scheduleReminders };
}
