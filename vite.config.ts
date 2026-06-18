import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite"; // 1. Import Tailwind v4

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    tailwindcss(), // 2. Add it right here!
  ],
});
