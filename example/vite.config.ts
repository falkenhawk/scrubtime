import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/scrubtime/',
  server: {
    allowedHosts: process.env.ALLOWED_HOSTS === 'all' ? true : undefined,
  },
});
