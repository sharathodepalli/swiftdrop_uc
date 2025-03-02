import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/swiftdrop_uc/', // ✅ Ensure this matches your GitHub repo name exactly
  resolve: {
    alias: {
      '@': '/src', // ✅ Use Vite's alias format instead of Node's `path.resolve`
    },
  },
});
