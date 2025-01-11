import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom', // Simule un environnement DOM pour les tests
    setupFiles: './src/test/setup.js', // (optionnel) Fichier de configuration pour les tests
  },
})
