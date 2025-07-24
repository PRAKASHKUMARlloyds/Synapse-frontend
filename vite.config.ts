import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
  server: {
    open: true,
  },
  build: {
    outDir: 'dist', // 👈 ensures Vite builds here (Cloud Run expects this)
  }
});
