import useDarkMode from "../hooks/useDarkMode";
import React from "react";

export default function DarkModeToggle() {
  const [theme, setTheme] = useDarkMode();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="px-3 py-2 rounded-md text-sm border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
    >
      {theme === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
