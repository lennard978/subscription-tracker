import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AddEditSubscription from "./pages/AddEditSubscription";
import Settings from "./pages/Settings";
import DarkModeToggle from "./components/DarkModeToggle";
import NotificationButton from "./components/NotificationButton";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="text-xl font-bold">
          💳 Subscription Tracker
        </Link>
        <div className="flex items-center gap-2">
          <NotificationButton />
          <DarkModeToggle />
        </div>
      </header>

      <main className="p-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddEditSubscription />} />
          <Route path="/edit/:id" element={<AddEditSubscription />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>
    </div>
  );
}
