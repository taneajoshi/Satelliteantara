import { defineConfig, splitVendorChunkPlugin } from "vite";
import vue from "@vitejs/plugin-vue";
import eslintPlugin from "vite-plugin-eslint";
import stylelint from "vite-plugin-stylelint";
import autoprefixer from "autoprefixer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    stylelint(),
    eslintPlugin({
      useEslintrc: true,
    }),
    splitVendorChunkPlugin(),
    vue(),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer({})],
    },
  },
});