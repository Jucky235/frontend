import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@/router/router";
import "./index.css"; // Loads your Tailwind configurations
import "@/lib/i18n"; // Initializes your i18n translations

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Swapping <App /> out for the RouterProvider handles page switching */}
    <RouterProvider router={router} />
  </React.StrictMode>,
);
