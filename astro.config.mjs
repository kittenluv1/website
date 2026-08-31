// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://bunnyluv1.com",

  redirects: {
    "/blog": "/blog/2026",
  },

  vite: {
    plugins: [tailwindcss()],
  },
});