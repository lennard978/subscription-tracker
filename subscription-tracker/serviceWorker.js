// ✅ Cache setup
const CACHE_NAME = "subscription-tracker-v3";
const urlsToCache = [
  "/subscription-tracker/",
  "/subscription-tracker/index.html",
];


// ✅ Install event: pre-cache essential assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// ✅ Activate: clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// ✅ Fetch handler: serve from cache first, fallback to network
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(
      (response) =>
        response ||
        fetch(event.request).catch(() => caches.match("/index.html"))
    )
  );
});

// ✅ Handle messages from main app (used for reminders)
self.addEventListener("message", (event) => {
  const { type, subscriptions } = event.data || {};

  // 🔔 Check renewals and send notifications
  if (type === "CHECK_RENEWALS" && Array.isArray(subscriptions)) {
    const today = new Date();

    subscriptions.forEach((sub) => {
      if (!sub.renewalDate) return;
      const renewalDate = new Date(sub.renewalDate);
      const diffDays = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24));

      // Show notification 1 day before renewal
      if (diffDays === 1 && self.registration?.showNotification) {
        self.registration.showNotification("🔔 Upcoming Renewal", {
          body: `${sub.name} renews tomorrow (€${sub.price})`,
          icon: "/subscription-tracker/icons/icon-192x192.png",
          badge: "/subscription-tracker/icons/icon-192x192.png",
        });
      }
    });
  }
});

// ✅ Notification click: open app when tapping the notification
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes("/subscription-tracker/") && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow("/subscription-tracker/");
        }
      })
  );
});
