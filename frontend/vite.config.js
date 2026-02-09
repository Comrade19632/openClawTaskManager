import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Важно для проксирования через nginx под /taskManager/
// В dev и build все ассеты/клиент Vite будут запрашиваться с этим префиксом.
const BASE = process.env.VITE_BASE || '/taskManager/'

export default defineConfig({
  base: BASE,
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // nginx проксирует с внешним Host, нужно разрешить домен
    allowedHosts: ['vm161818.xxvps.net', 'localhost', '127.0.0.1'],
  },
})
