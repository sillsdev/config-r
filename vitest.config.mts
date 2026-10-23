import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Kept apart from vite.config.mts, whose library build (declaration files, externals) tests do
// not need.
export default defineConfig({
  plugins: [react({ jsxImportSource: '@emotion/react' })],
  test: {
    environment: 'jsdom',
    include: ['lib/**/*.test.tsx'],
  },
});
