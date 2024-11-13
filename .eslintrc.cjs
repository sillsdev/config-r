module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    //'plugin:prettier/recommended',
    'plugin:storybook/recommended',
  ],
  //plugins: ['prettier'],
  plugins: ['@emotion'], // Review: I don't know what check this does
  rules: {
    'react/no-unknown-property': ['error', { ignore: ['css'] }], // https://github.com/emotion-js/emotion/pull/2882/files
    'react/no-unescaped-entities': 0,
    'no-unused-vars': 0,
    // 'prettier/prettier': [
    //   'error',
    //   {},
    //   {
    //     usePrettierrc: true,
    //   },
    // ],
    'react/react-in-jsx-scope': 'off',
    'jsx-a11y/accessible-emoji': 'off',
    'react/prop-types': 'off',
    'react/display-name': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
  },
};
