export function registerSWUpdateListener(showToast) {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      showToast("New version installed", "success");
    });

    navigator.serviceWorker.register("/subscription-tracker/serviceWorker.js")
      .then((reg) => {
        if (reg.waiting) {
          showToast("App updated — reload to apply", "info");
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed") {
              if (navigator.serviceWorker.controller) {
                showToast("New version available — reload", "info");
              }
            }
          });
        });
      });
  }
}
