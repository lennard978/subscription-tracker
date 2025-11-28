const CACHE_NAME = "subscription-tracker-v2";
const urlsToCache = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(
      (response) => response || fetch(event.request)
    )
  );
});

// ✅ Background check for renewals
const checkRenewals = async () => {
  try {
    const clients = await self.clients.matchAll({ includeUncontrolled: true });
    if (!clients.length) return;

    const client = clients[0];
    const result = await client.postMessage({ type: "GET_SUBSCRIPTIONS" });

    // The client (the app) will respond with subscriptions
  } catch (err) {
    console.error("Background renewal check failed:", err);
  }
};

// Run every 6 hours
setInterval(checkRenewals, 6 * 60 * 60 * 1000);

// ✅ Handle notification trigger from main app
self.addEventListener("message", (event) => {
  const { type, subscriptions } = event.data || {};
  if (type === "CHECK_RENEWALS" && Array.isArray(subscriptions)) {
    const today = new Date();
    subscriptions.forEach((sub) => {
      const renewalDate = new Date(sub.renewalDate);
      const diffDays = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        self.registration.showNotification("🔔 Upcoming Renewal", {
          body: `${sub.name} renews tomorrow (€${sub.price})`,
          icon: "/icons/icon-192x192.png",
        });
      }
    });
  }
  self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(clients.openWindow("/subscription-tracker/"));
  });

});
