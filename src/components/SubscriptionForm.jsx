import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import React from "react";

export default function SubscriptionForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [subscriptions, setSubscriptions] = useLocalStorage("subscriptions", []);

  const existing = subscriptions.find((s) => s.id === id);

  const [formData, setFormData] = useState(
    existing || {
      id: crypto.randomUUID(),
      name: "",
      price: "",
      billingCycle: "Monthly",
      renewalDate: "",
      notes: "",
    }
  );

  useEffect(() => {
    if (existing) setFormData(existing);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.renewalDate) {
      alert("Please fill all required fields!");
      return;
    }

    const updatedList = existing
      ? subscriptions.map((s) => (s.id === id ? formData : s))
      : [...subscriptions, formData];

    setSubscriptions(updatedList);
    navigate("/");
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-md shadow-md space-y-4"
    >
      <h1 className="text-2xl font-semibold text-center">
        {existing ? "Edit Subscription" : "Add Subscription"}
      </h1>

      {/* Name */}
      <div>
        <label className="block mb-1 text-sm font-medium">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
          placeholder="e.g. Netflix"
          required
        />
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 text-sm font-medium">Price (€)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
          placeholder="9.99"
          required
        />
      </div>

      {/* Billing cycle */}
      <div>
        <label className="block mb-1 text-sm font-medium">Billing Cycle</label>
        <select
          name="billingCycle"
          value={formData.billingCycle}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
        >
          <option>Monthly</option>
          <option>Yearly</option>
          <option>Weekly</option>
        </select>
      </div>

      {/* Renewal date */}
      <div>
        <label className="block mb-1 text-sm font-medium">Renewal Date</label>
        <input
          type="date"
          name="renewalDate"
          value={formData.renewalDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
          required
        />

        {/* Show formatted preview */}
        {formData.renewalDate && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {formatDate(formData.renewalDate)}
          </p>
        )}
      </div>


      {/* Notes */}
      <div>
        <label className="block mb-1 text-sm font-medium">Comments</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700"
          placeholder="Optional comments..."
        ></textarea>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          {existing ? "Update" : "Add"}
        </button>
      </div>
    </form>
  );
}
