// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider, useToast } from "./context/ToastContext";
import { AuthProvider } from "./hooks/useAuth";
import { registerSWUpdateListener } from "./swUpdate.js";
import "./i18n.js";

function SWUpdateWrapper({ children }) {
  const { showToast } = useToast();

  React.useEffect(() => {
    if (import.meta.env.PROD) {
      registerSWUpdateListener(showToast);
    }
  }, [showToast]);

  return children;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ToastProvider>
      <AuthProvider>
        <SWUpdateWrapper>
          <BrowserRouter

            basename={import.meta.env.PROD ? "/subscription-tracker" : "/"}
          >
            <App />
          </BrowserRouter>
        </SWUpdateWrapper>
      </AuthProvider>
    </ToastProvider>
  </React.StrictMode>
);
