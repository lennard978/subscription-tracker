import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

export default function Analytics({ subscriptions }) {
  if (!subscriptions || subscriptions.length === 0) {
    return (
      <p className="text-gray-500 dark:text-gray-400 text-center mt-4">
        Add subscriptions to view analytics.
      </p>
    );
  }

  // Calculate monthly cost
  const subsWithMonthly = subscriptions.map((s) => ({
    ...s,
    monthlyCost: s.frequency === "monthly" ? s.price : s.price / 12,
  }));

  // Category data
  const categoryTotals = {};
  subsWithMonthly.forEach((s) => {
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + s.monthlyCost;
  });

  const pieData = Object.entries(categoryTotals).map(([category, amount]) => ({
    name: category,
    value: Number(amount.toFixed(2)),
  }));

  // Total
  const totalMonthly = subsWithMonthly.reduce((sum, s) => sum + s.monthlyCost, 0);

  const barData = [
    { name: "Total Monthly Cost", amount: Number(totalMonthly.toFixed(2)) },
  ];

  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f87171",
    "#a3e635",
    "#fde047",
  ];

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold mb-4">Analytics</h2>

      {/* Pie Chart */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4 mb-6" style={{ height: "300px" }}>
        <h3 className="text-sm mb-2">Monthly Cost by Category</h3>

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={80} label>
              {pieData.map((entry, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="w-full bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-800 p-4 mb-6" style={{ height: "300px" }}>
        <h3 className="text-sm mb-2">Total Monthly Spend</h3>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
