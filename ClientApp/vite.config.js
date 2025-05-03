import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // Import the path module

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react()],
    // Define base based on mode (dev vs prod)
    // In Dev, it's root '/' relative to the Vite server (localhost:5173)
    // In Prod, it's '/react-app/' relative to the MVC app domain
    base: isProduction ? '/react-app/' : '/',
    server: {
      port: 5173, // Ensure this port is free
      strictPort: true, // Don't try another port if 5173 is busy
      hmr: {
        // Needed for HMR when proxying or running in container/WSL
        clientPort: 5173,
      }
    },
    build: {
      outDir: '../wwwroot/react-app', // Output to wwwroot/react-app
      emptyOutDir: true, // Clear the directory before building
      sourcemap: true, // Generate source maps for prod build debugging
      rollupOptions: {
        // Optional: configure specific output filenames if needed,
        // but default hashed names are good for caching.
        // output: {
        //   entryFileNames: `assets/[name].js`,
        //   chunkFileNames: `assets/[name].js`,
        //   assetFileNames: `assets/[name].[ext]`
        // }
      }
    }
  }
})