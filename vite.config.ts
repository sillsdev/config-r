import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
//import copy from 'rollup-plugin-copy';
const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  // TODO: switch to @vitejs/plugin-react?
  plugins: [
    reactRefresh(),
    dts({
      // root: 'lib',
      // outputDir: 'dist/typings',
      // tsConfigFilePath: '../tsconfig.json',
      // skipDiagnostics: false,
      // logDiagnostics: true,
    }),
    // copy({
    //   targets: [{ src: './package.json', dest: 'dist/' }],
    //   verbose: true,
    //   hook: 'writeBundle',
    // }),
  ],
  esbuild: {
    jsxFactory: `jsx`,
    jsxInject: `import { jsx } from '@emotion/react'`,
  },

  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
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
