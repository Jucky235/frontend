import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 🌟 1. Import the Tailwind Vite engine
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(), // 🌟 2. Add Tailwind directly into your compiler chain
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_API_TARGET || "http://localhost:3000",
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: Number(process.env.PORT) || 4173,
      allowedHosts: ["eng-frontend-u1dc.onrender.com"],
    },
  };
});
