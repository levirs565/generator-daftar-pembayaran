import { defineConfig } from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[64, "favicon.ico"]],
    },
    maskable: {
      sizes: [512],
      padding: 0,
      resizeOptions: {
        background: "#97266D",
      },
    },
    apple: {
      sizes: [180],
    },
  },
  images: ["public/favicon.svg"],
});
