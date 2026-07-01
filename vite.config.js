import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // 백엔드로 넘긴다
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""), // 최종 백엔드 요청 url
      },
    },
  },
});
