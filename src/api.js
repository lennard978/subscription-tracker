// src/api.js

// This file contains placeholder API functions.
// Later, you will replace the fetch() calls with real FastAPI endpoints.

const API_BASE = "http://localhost:8000"; // UPDATE when backend is ready

// ------------------------------
// AUTH MOCK ENDPOINTS
// ------------------------------

export async function apiSignup(email, password) {
  // Placeholder - real implementation will call FastAPI
  return { success: true, user: { email } };
}

export async function apiLogin(email, password) {
  // Placeholder - real implementation will call FastAPI
  return { success: true, user: { email } };
}

// ------------------------------
// STRIPE SESSION (PREMIUM)
// ------------------------------

export async function apiCreateCheckoutSession(plan = "monthly") {
  // Placeholder - real implementation calls FastAPI+/api/create-checkout-session

  // Example return structure (to match Stripe Checkout)
  return {
    url: "https://checkout.stripe.com/pay/mock_session_placeholder",
  };
}

// ------------------------------
// USER SUBSCRIPTION INFO
// ------------------------------

export async function apiGetSubscriptionStatus() {
  // Placeholder - real implementation will check Stripe subscription
  return {
    active: false,
    renewsAt: null,
    plan: null,
  };
}
