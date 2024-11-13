import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    dts({
      //root: 'lib',
      //outputDir: 'dist/typings',
      //tsConfigFilePath: 'tsconfig.json',
    }),
    react({}),
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'configr',
      formats: ['es'],
      fileName: (format) => `configr.${format}${format === 'umd' ? '.cjs' : '.js'}`,
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      // don't bundle these with the library
      external: [
        'react',
        'react/jsx-runtime.js', // Add .js extension
        'react-dom',
        'react-dom/client',
        /^@mui\/material\/[^/]+\.js$/, // Match MUI imports with .js extension
        /^@emotion\/.*$/,
      ],
      output: {
        exports: 'named',
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
          'react/jsx-runtime.js': 'react-jsx-runtime', // Update path
          '@mui/material/FormControl': 'mui-material-formcontrol',
          '@mui/material/FormHelperText': 'mui-material-form-helper-text',
          '@mui/material/InputLabel': 'mui-material-input-label',
          '@mui/material/Select': 'mui-material-select',
        },
        interop: 'auto',
      },
    },
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@mui/material/': '@mui/material/*.js',
      '@mui/material/styles': '@mui/material/styles/index.js',
      '@mui/material/utils': '@mui/material/utils/index.js',
      //'react/jsx-runtime': 'react/jsx-runtime.js',
    },
  },
});
