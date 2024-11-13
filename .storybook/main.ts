import react from '@vitejs/plugin-react';
import path from 'path';

const config = {
  async viteFinal(config) {
    config.plugins = config.plugins.filter(
      (plugin) => !(Array.isArray(plugin) && plugin[0]?.name.includes('vite:react')),
    );

    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        react: path.resolve(__dirname, '../node_modules/react'),
        'react/jsx-runtime': path.resolve(__dirname, '../node_modules/react/jsx-runtime'),
      },
    };

    config.optimizeDeps = {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), 'react/jsx-runtime'],
    };

    config.plugins.push(
      react({
        exclude: [/\.stories\.(t|j)sx?$/, /node_modules/],
        jsxImportSource: '@emotion/react',
        babel: {
          plugins: ['@emotion/babel-plugin'],
        },
      }),
    );

    return config;
  },
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    builder: '@storybook/builder-vite',
  },
};

export default config;
