import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '^/(auth|food-logs|prediction|recovery|rescue|dashboard|health|vision|users|system|export|history|static)': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept && req.headers.accept.includes('text/html')) {
            return req.url; // Skip proxy for frontend navigation
          }
        }
      }
    }
  }
})
