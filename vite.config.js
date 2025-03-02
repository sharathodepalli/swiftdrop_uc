import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': '/src', // ✅ Use Vite's alias format instead of Node's `path.resolve`
    },
  },
});
