import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux"; // 1. Import Redux Provider
import { store } from "@/redux/store"; // 2. Import your central store configuration
import { router } from "@/router/router";
import "./index.css"; // Loads your Tailwind configurations
import "@/lib/i18n"; // Initializes your i18n translations

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 3. Wrap everything here to broadcast Redux to all routes */}
    <Provider store={store}>
      {/* Swapping <App /> out for the RouterProvider handles page switching */}
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
