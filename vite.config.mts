import { defineConfig } from 'vite-plus';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  // `command` is 'build' when packaging the library (`vp build`) and 'serve'
  // for the dev playground (`vp dev`). The MUI `.js` alias / externalization
  // workarounds below are only needed for the library build; applying them to
  // the dev server breaks MUI dependency optimization under rolldown.
  const isLibraryBuild = command === 'build';

  return {
    fmt: {
      semi: true,
      trailingComma: 'all',
      singleQuote: true,
      printWidth: 90,
      tabWidth: 2,
      sortPackageJson: false,
      ignorePatterns: [
        'node_modules',
        '.DS_Store',
        'dist',
        'dist-ssr',
        '*.local',
        'node_modules/*',
      ],
    },
    lint: {
      ignorePatterns: ['dist/**', 'storybook-static/**'],
      rules: {
        // The previous .eslintrc.cjs disabled no-unused-vars; keep that parity.
        'no-unused-vars': 'off',
      },
    },
    // Pre-commit hook (installed by `vp config`) runs these on staged files,
    // replacing the previous simple-git-hooks + eslint/prettier pre-commit.
    staged: {
      '*.{js,jsx,ts,tsx,css,md,json}': 'vp check --fix',
    },
    test: {
      // This project has no test suite yet. Don't let `vp test` fail on an empty
      // suite; remove this once real tests are added under lib/ or src/.
      passWithNoTests: true,
    },
    plugins: [
      // Declaration files are only needed for the published library.
      ...(isLibraryBuild
        ? [
            dts({
              //root: 'lib',
              // include: ['lib/**/*'],
              exclude: ['src/**/*', '.storybook/**/*'],
            }),
          ]
        : []),
      react({}),
    ],

    ...(isLibraryBuild
      ? {
          build: {
            lib: {
              entry: resolve(__dirname, 'lib/index.ts'),
              name: 'configr',
              formats: ['es', 'cjs'],
              fileName: (format) => `configr.${format === 'cjs' ? 'cjs' : 'es'}.js`,
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
        }
      : {
          // Open the browser automatically when the dev playground starts.
          server: {
            open: true,
          },
          resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
            alias: [
              // The MUI cluster is served as native ESM below (see optimizeDeps).
              // `@mui/icons-material/<Name>` deep imports resolve to CommonJS
              // files, which can't be served raw; redirect them to the ESM build.
              {
                find: /^@mui\/icons-material\/((?!esm\/).*)$/,
                replacement: '@mui/icons-material/esm/$1',
              },
            ],
          },
          optimizeDeps: {
            // Rolldown's dep optimizer (Vite 8) can't follow the `export *` chain
            // that surfaces `createFilterOptions` from MUI 5's Autocomplete, so
            // pre-bundling the `@mui/material` barrel fails. Serve the whole MUI
            // cluster as native ESM instead (exclude), keeping the packages that
            // reference each other consistent. Their CJS leaf deps are force
            // pre-bundled (include) so Vite's CJS→ESM interop still provides the
            // default exports that `import PropTypes from 'prop-types'` etc. need.
            exclude: [
              '@mui/material',
              '@mui/icons-material',
              '@mui/base',
              '@mui/system',
              '@mui/utils',
              '@mui/styled-engine',
              '@mui/private-theming',
              'formik-mui',
            ],
            include: [
              'prop-types',
              'react-is',
              'hoist-non-react-statics',
              'react-transition-group',
            ],
          },
        }),
  };
});
