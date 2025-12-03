import { useEffect } from "react";

export default function useNotifications(subscriptions) {
  useEffect(() => {
    if (!subscriptions || subscriptions.length === 0) return;

    // Check once a day
    const interval = setInterval(() => {
      checkRenewals();
    }, 24 * 60 * 60 * 1000);

    // Check immediately when app opens
    checkRenewals();

    return () => clearInterval(interval);
  }, [subscriptions]);

  function notify(title, body) {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/subscription-tracker/pwa-192x192.png", // Works in prod
      });
    }
  }

  function checkRenewals() {
    const today = new Date();

    subscriptions.forEach((sub) => {
      const renewalDate = new Date();
      const daysBeforeNotify = 1;

      // monthly subscription -> add 1 month
      if (sub.frequency === "monthly") {
        renewalDate.setMonth(today.getMonth() + 1);
      } else {
        // yearly subscription -> add 1 year
        renewalDate.setFullYear(today.getFullYear() + 1);
      }

      renewalDate.setDate(renewalDate.getDate() - daysBeforeNotify);

      // If today is the reminder day
      if (
        today.toDateString() === renewalDate.toDateString()
      ) {
        notify(
          "Upcoming Subscription Renewal",
          `${sub.name} renews tomorrow (€${sub.price}).`
        );
      }
    });
  }
}
