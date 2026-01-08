import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import observerPlugin from "mobx-react-observer/babel-plugin";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler", observerPlugin()],
      },
    }),
    tailwindcss(),
  ],
});
