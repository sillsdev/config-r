import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  // TODO: switch to @vitejs/plugin-react?
  plugins: [reactRefresh()],
  esbuild: {
    jsxFactory: `jsx`,
    jsxInject: `import { jsx } from '@emotion/react'`,
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/lib/index.ts'),
      name: 'configr',
      fileName: (format) => `configr.${format}.js`,
    },
    rollupOptions: {
      // don't bundle these with the library
      external: ['react', 'react-dom'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },
});
