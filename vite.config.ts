import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';

// 1) this one works except for one problem: https://github.com/qmhc/vite-plugin-dts/issues/59
import dts from 'vite-plugin-dts';

// 2) I tried just using tsup instead of vitejs for the actual library build, but then of course it has it's own quirks to work though and seems like a bad idea.

// 3) this one (https://github.com/alloc/vite-dts) is unusual in that it basically just points at your source code... it doesn't generate anything.
//import dumbDts from 'vite-dts';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  // TODO: switch to @vitejs/plugin-react?
  plugins: [
    reactRefresh(),
    dts({
      //root: 'lib',
      //outputDir: 'dist/typings',
      tsConfigFilePath: 'tsconfig.json',
    }),
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
