import React from "react";
import { useAuth } from "../hooks/useAuth";

// Helper to compute remaining trial days
function getTrialDaysLeft(trialStart) {
  if (!trialStart) return 0;

  const start = new Date(trialStart);
  const now = new Date();

  const diff = Math.floor(
    (now - start) / (1000 * 60 * 60 * 24)
  );

  const daysLeft = 7 - diff;
  return daysLeft > 0 ? daysLeft : 0;
}

export default function TrialBanner() {
  const { trialStart, isTrialExpired } = useAuth();

  if (!trialStart || isTrialExpired) return null;

  const daysLeft = getTrialDaysLeft(trialStart);

  return (
    <div className="mb-4 p-3 rounded-md bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-100 border border-blue-200 dark:border-blue-800">
      {daysLeft === 1
        ? "Your free trial ends tomorrow."
        : `Your free trial ends in ${daysLeft} days.`}
    </div>
  );
}
