import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";

export default function SubscriptionForm() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState("monthly");
  const [category, setCategory] = useState("Other");

  // List of categories
  const categories = [
    "Streaming",
    "Fitness",
    "Software",
    "Productivity",
    "Gaming",
    "Bills",
    "Education",
    "Transport",
    "Food",
    "Other",
  ];

  useEffect(() => {
    if (id) {
      const saved = JSON.parse(localStorage.getItem("subscriptions")) || [];
      const existing = saved.find((s) => s.id === Number(id));

      if (existing) {
        setName(existing.name);
        setPrice(existing.price);
        setFrequency(existing.frequency);
        setCategory(existing.category || "Other"); // default for older entries
      }
    }
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast("Name is required", "error");
      return;
    }

    if (!price || Number(price) <= 0) {
      showToast("Price must be a positive number", "error");
      return;
    }

    const saved = JSON.parse(localStorage.getItem("subscriptions")) || [];

    if (id) {
      // Edit mode
      const updated = saved.map((s) =>
        s.id === Number(id)
          ? { ...s, name, price: Number(price), frequency, category }
          : s
      );
      localStorage.setItem("subscriptions", JSON.stringify(updated));
      showToast("Subscription updated", "success");
    } else {
      // Add mode
      const newSub = {
        id: Date.now(),
        name,
        price: Number(price),
        frequency,
        category,
      };
      saved.push(newSub);
      localStorage.setItem("subscriptions", JSON.stringify(saved));
      showToast("Subscription added", "success");
    }

    navigate("/dashboard");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
      <h1 className="text-xl font-semibold mb-6">
        {id ? "Edit Subscription" : "Add Subscription"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block mb-1 text-sm">Name</label>
          <input
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Netflix, Gym, Adobe..."
          />
        </div>

        {/* Price */}
        <div>
          <label className="block mb-1 text-sm">Price (€)</label>
          <input
            type="number"
            step="0.01"
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-800"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="block mb-1 text-sm">Billing Frequency</label>
          <select
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-800"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
          >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block mb-1 text-sm">Category</label>
          <select
            className="w-full px-3 py-2 rounded-md border dark:bg-gray-800"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {id ? "Save Changes" : "Add Subscription"}
        </button>
      </form>
    </div>
  );
}
