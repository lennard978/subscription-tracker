const CACHE_NAME = "subscription-tracker-v2";
const BASE_PATH = "/subscription-tracker";

const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.ico`,
  `${BASE_PATH}/logo192.png`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", (event) => {
  const requestURL = new URL(event.request.url);

  // Fix for GitHub Pages base path
  if (requestURL.origin === location.origin && requestURL.pathname === "/") {
    event.respondWith(caches.match(`${BASE_PATH}/index.html`));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

/* ✅ Background Push Support */
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: "🔔 Subscription Tracker", body: "New notification" };
  }

  const title = data.title || "🔔 Subscription Tracker";
  const options = {
    body: data.body || "Check your subscriptions",
    icon: `${BASE_PATH}/icons/icon-192x192.png`,
    badge: `${BASE_PATH}/icons/icon-96x96.png`,
    data: {
      url: data.url || `${BASE_PATH}/`,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ✅ Handle Notification Clicks Correctly */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || `${BASE_PATH}/`;
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );

  /* ✅ Local push simulation for testing */
  self.addEventListener("message", (event) => {
    if (event.data?.action === "simulate-push") {
      const { title, body, url } = event.data.data;
      self.registration.showNotification(title, {
        body,
        icon: `${BASE_PATH}/icons/icon-192x192.png`,
        data: { url },
      });
    }
  });

  self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return (
          response ||
          fetch(event.request).catch(() => caches.match("/index.html"))
        );
      })
    );
  });

});
