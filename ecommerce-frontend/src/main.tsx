import AppRouter from "@app/routes/AppRouter";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { store, persistor } from "./app/store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "@fortawesome/fontawesome-free/css/all.min.css";

const authRedirected = sessionStorage.getItem("authRedirected");
if (authRedirected === "1") {
  console.warn("Clearing stale redux-persist data after 401...");
  localStorage.removeItem("persist:root");
  sessionStorage.removeItem("authRedirected");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouter />
      </PersistGate>
    </Provider>
  </StrictMode>,
);
