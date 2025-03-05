import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/swiftdrop_uc/', // Change from '/swiftdrop_uc/' to '/'
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
