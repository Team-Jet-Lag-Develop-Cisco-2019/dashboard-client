module.exports = {
  env: {
    test: {
      retainLines: true,
    },
  },
  presets: [
    [
      '@babel/env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/react',
  ],
  plugins: [
    ['add-react-displayname'],
    [
      '@babel/plugin-proposal-decorators',
      {
        decoratorsBeforeExport: true,
      },
    ],
    [
      'babel-plugin-transform-builtin-extend',
      {
        globals: ['Error'],
      },
    ],
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    'lodash',
    [
      'react-intl',
      {
        messagesDir: './tmp/translations/extractedMessages/',
        enforceDescriptions: false,
      },
    ],
  ],
};
