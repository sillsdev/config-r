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
  // for the dev playground (`vp dev`). The two need different MUI handling under
  // rolldown: the library externalizes all of MUI, while the dev server serves
  // it as native ESM. Keeping them separate avoids each one's workarounds
  // breaking the other.
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
              formats: ['es', 'cjs'],
              // Under "type": "module", the CommonJS output must use a `.cjs`
              // extension or Node/bundlers treat it as ESM (its `exports.*` then
              // read as "no exports" for `require()` consumers).
              fileName: (format) => (format === 'cjs' ? 'configr.cjs' : 'configr.es.js'),
            },
            sourcemap: true,
            emptyOutDir: true,
            rollupOptions: {
              // React, MUI, and Emotion are peer dependencies — never bundle any
              // of them (or their submodules) into the library. Bundling MUI's
              // internals produced broken output under rolldown; keeping the whole
              // @mui/@emotion/react trees external lets the consumer provide them.
              external: [/^react($|\/)/, /^react-dom($|\/)/, /^@mui\//, /^@emotion\//],
              output: {
                exports: 'named',
                // `@mui/material/styles` is a directory import. Rewrite the
                // externalized specifier to the explicit index file so the
                // output resolves under strict ESM (e.g. Node) as well as via
                // bundlers. (alias doesn't apply to external specifiers.)
                paths: {
                  '@mui/material/styles': '@mui/material/styles/index.js',
                },
              },
            },
          },
          resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx'],
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
