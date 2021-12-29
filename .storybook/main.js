module.exports = {
  /*************************
   *
   * NOTE: I was not able to get storybook working with the emotion css-prop under vite.
   * Gave it a couple hours, decided to wait until some parts leave alpha and in the
   * meantime, just run one of the stories at a time, from app. That is, compiled by
   * vite instead of storybook-builder-vite.
   *
   * The viteFinal() here was my attempt to get it working.
   */

  async viteFinal(config, { configType }) {
    return {
      ...config,
      // set up for @emotion
      esbuild: {
        jsxFactory: `jsx`,
        jsxInject: `import { jsx } from '@emotion/react'`,
      },
      optimizeDeps: {
        ...config.optimizeDeps,
        //  suggested by https://github.com/eirslett/storybook-builder-vite/issues/37 (didn't help)
        // include: [...config.optimizeDeps.include, '@emotion/react'],
      },
    };
  },
  //suggested by https://github.com/storybookjs/storybook/issues/13145#issuecomment-991906189 , didn't help
  //features: { emotionAlias: false },
  stories: ['../src/**/stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  framework: '@storybook/react',
  core: {
    builder: 'storybook-builder-vite',
  },
};
