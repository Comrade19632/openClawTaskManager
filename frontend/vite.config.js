import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  base: "/taskManager/",
  server: {
    allowedHosts: ["vm161818.xxvps.net"],
  },
  preview: {
    allowedHosts: ["vm161818.xxvps.net"],
  },
})
