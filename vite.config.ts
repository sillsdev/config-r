import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 1) this one works except for one problem: https://github.com/qmhc/vite-plugin-dts/issues/59
import dts from 'vite-plugin-dts';

// 2) I tried just using tsup instead of vitejs for the actual library build, but then of course it has it's own quirks to work though and seems like a bad idea.

// 3) this one (https://github.com/alloc/vite-dts) is unusual in that it basically just points at your source code... it doesn't generate anything.
//import dumbDts from 'vite-dts';

const path = require('path');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      //root: 'lib',
      //outputDir: 'dist/typings',
      tsConfigFilePath: 'tsconfig.json',
    }),
    react({}),
  ],

  build: {
    lib: {
      entry: path.resolve(__dirname, 'lib/index.ts'),
      name: 'configr',
      fileName: (format) => `configr.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      // don't bundle these with the library
      external: [
        /@emotion.*/,
        /@mui.*/,
        'react',
        'react/jsx-runtime',
        'react-dom',
        'react-dom/client',
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
          'react-dom': 'ReactDom',
          '@emotion/react': 'emotion-react',
          '@emotion/react/jsx-runtime': 'emotion-react-jsx-runtime',
          '@mui/material': 'mui-material',
          '@mui/material/styles': 'mui-material/styles',
          '@mui/material/utils?commonjs-external': 'mui-matierial-utils',
          'react/jsx-runtime': 'react-jsx-runtime',
          '@mui/material/FormControl': 'mui-material-formcontrol',
          '@mui/material/FormHelperText': 'mui-material-form-helper-text',
          '@mui/material/InputLabel': 'mui-material-input-label',
          '@mui/material/Select': 'mui-material-select',
        },
      },
    },
  },
});
