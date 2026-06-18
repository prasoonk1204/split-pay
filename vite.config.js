import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Polyfill Node.js built-ins needed by @stellar/stellar-sdk and @creit.tech/stellar-wallets-kit
      include: ['buffer', 'events', 'util', 'stream', 'process'],
      globals: {
        Buffer: true,
        global: false, // keep false — avoids triggering SSR mode in react-three-fiber
        process: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      external: ['url', 'zlib'],
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    server: {
      deps: {
        inline: [/@stellar\/freighter-api/, /@creit\.tech\/stellar-wallets-kit/]
      }
    }
  }
})
