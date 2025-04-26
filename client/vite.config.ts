import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// https://vite.dev/config/
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../../dist", // Change this to whatever folder you want
    emptyOutDir: true, // optional: cleans the folder before each build
  },
  root: __dirname,
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000",
        // or wherever your backend runs
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
});
