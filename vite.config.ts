
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to access cwd() when node types are not fully recognized in the config environment
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  // Sanitize the API Key from all possible sources
  let apiKey = (process.env.API_KEY || env.API_KEY || env.VITE_API_KEY || "").trim();
  apiKey = apiKey.replace(/^["'](.+)["']$/, '$1');

  return {
    plugins: [react()],
    define: {
      // Using a custom global constant is often more reliable than process.env
      '__API_KEY__': JSON.stringify(apiKey),
      'process.env.API_KEY': JSON.stringify(apiKey),
      'process.env.NODE_ENV': JSON.stringify(mode),
    },
    server: {
      port: 3000,
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
    }
  }
})
