import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddEditSubscription from "./pages/AddEditSubscription";
import Settings from "./pages/Settings";
import DarkModeToggle from "./components/DarkModeToggle";
import NotificationButton from "./components/NotificationButton";

export default function App() {
  const [subscriptions, setSubscriptions] = useState([]);

  // ✅ Load subscriptions from localStorage on mount
  useEffect(() => {
    const savedSubs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    setSubscriptions(savedSubs);
  }, []);

  // ✅ Re-run when subscriptions change
  useEffect(() => {
    if ("serviceWorker" in navigator && subscriptions.length) {
      navigator.serviceWorker.ready.then((reg) => {
        if (reg.active) {
          reg.active.postMessage({
            type: "CHECK_RENEWALS",
            subscriptions,
          });
        }
      });
    }
  }, [subscriptions]);

  useEffect(() => {
    const savedSubs = JSON.parse(localStorage.getItem("subscriptions") || "[]");
    savedSubs
      .filter((s) => s.hasReminder)
      .forEach((s) => {
        const renewalDate = new Date(s.renewalDate);
        const now = new Date();
        const msUntilReminder = renewalDate - now - 24 * 60 * 60 * 1000; // 1 day before

        if (msUntilReminder > 0) {
          setTimeout(async () => {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg && reg.showNotification) {
              reg.showNotification("💳 Subscription Reminder", {
                body: `${s.name} renews tomorrow (€${s.price})`,
                icon: "/subscription-tracker/icon-192.png",
              });
            }
          }, msUntilReminder);
        }
      });
  }, []);

  const IMAGES = {
    image1: new URL('/icons/icon-192.png', import.meta.url).href
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <header className="flex justify-between items-center p-2 border-b border-gray-200 dark:border-gray-800">
        <img loading="lazy"
          width="60"
          height="60"
          sizes="auto, (max-width: 30em) 100vw, (max-width: 50em) 50vw, calc(33vw - 100px)" src={IMAGES.image1} alt='first image' />
        <div className="flex flex-col md:flex-row md:gap-1 justify-center items-center">
          <Link to="/" className="text-xl font-bold">
            Subscription
          </Link>
          <Link to="/" className="text-xl font-bold">
            Tracker
          </Link>

        </div>


        <div className="flex items-center gap-2">
          <NotificationButton />
          <DarkModeToggle />
        </div>
      </header>

      <main className="p-4">
        <Routes>
          {/* ✅ Pass subscriptions + updater to Dashboard */}
          <Route
            path="/"
            element={
              <Dashboard
                subscriptions={subscriptions}
                setSubscriptions={setSubscriptions}
              />
            }
          />
          <Route
            path="/add"
            element={<AddEditSubscription setSubscriptions={setSubscriptions} />}
          />
          <Route
            path="/edit/:id"
            element={<AddEditSubscription setSubscriptions={setSubscriptions} />}
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
