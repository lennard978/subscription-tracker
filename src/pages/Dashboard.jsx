import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SubscriptionItem from "../components/SubscriptionItem";
import TrialBanner from "../components/TrialBanner";
import Analytics from "../components/Analytics";
import useNotifications from "../hooks/useNotifications";
import { useTranslation } from "react-i18next";

export default function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Load subscriptions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("subscriptions");
    if (saved) {
      setSubscriptions(JSON.parse(saved));
    }
  }, []);

  // Calculate total monthly cost
  const totalMonthly = subscriptions.reduce((sum, item) => {
    const months =
      item.frequency === "monthly"
        ? 1
        : item.frequency === "yearly"
          ? 12
          : 1;

    return sum + item.price / months;
  }, 0);

  // Notifications
  useNotifications(subscriptions);

  return (
    <div>
      <TrialBanner />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">{t("dashboard_title")}</h1>

        <button
          onClick={() => navigate("/add")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Subscription
        </button>
      </div>

      <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
        {t("dashboard_total_monthly")}:        <span className="font-semibold ml-2">
          €{totalMonthly.toFixed(2)}
        </span>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p className="mb-3">{t("dashboard_empty")}</p>
          <Link
            to="/add"
            className="text-blue-600 hover:underline"
          >
            {t("dashboard_empty_cta")}          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <SubscriptionItem
              key={sub.id}
              item={sub}
              onDelete={(id) => {
                const updated = subscriptions.filter((s) => s.id !== id);
                setSubscriptions(updated);
                localStorage.setItem("subscriptions", JSON.stringify(updated));
              }}
            />
          ))}
        </div>
      )}

      <Analytics subscriptions={subscriptions} />
    </div>
  );
}
