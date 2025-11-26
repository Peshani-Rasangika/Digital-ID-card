import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy for the Guest User Invitation API
      "/api/asgardeo-guest/v1": {
        target: "https://api.asgardeo.io/t/idcardapp",
        changeOrigin: true,
        secure: true,
      },
      // Keep the SCIM proxy in case it's needed later
      "/scim2": {
        target: "https://api.asgardeo.io/t/idcardapp",
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
