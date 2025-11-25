import { useEffect } from "react";
import useNotifications from "./useNotifications";
import useLocalStorage from "./useLocalStorage";

export default function useRenewalNotifications() {
  const { notify } = useNotifications();
  const [subscriptions] = useLocalStorage("subscriptions", []);

  useEffect(() => {
    if (Notification.permission !== "granted") return;

    const today = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(today.getDate() + 3);

    subscriptions.forEach((sub) => {
      if (!sub.renewalDate) return;
      const renewal = new Date(sub.renewalDate);

      // If renewal is within next 3 days
      if (renewal >= today && renewal <= threeDaysFromNow) {
        notify("Upcoming Renewal", {
          body: `${sub.name} renews on ${renewal.toLocaleDateString()}.`,
          icon: "/icons/icon-192.png",
        });
      }
    });
  }, [subscriptions]);
}
