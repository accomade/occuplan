import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
/** @type {import('vite').UserConfig} */
const config = defineConfig({
  plugins: [sveltekit()],
  test: {
    include: ["src/**/*.{test,spec}.{js,ts}"],
  },
});

export default config;
