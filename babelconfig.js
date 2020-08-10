const sass = require('sass'); // eslint-disable-line

module.exports = {
  client: {
    presets: [
      [
        '@babel/preset-env',
        {
          modules: false,
          targets: {
            browsers: [
              'last 2 Chrome versions',
              'last 2 Edge versions',
              'last 2 Firefox versions',
              'last 2 Safari versions',
            ],
          },
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
    ],
  },

  server: {
    presets: [
      [
        '@babel/env',
        {
          targets: {
            node: true,
          },
        },
      ],
      '@babel/preset-react',
    ],
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
      ['@babel/plugin-proposal-pipeline-operator', { proposal: 'minimal' }],
      [
        'css-modules-transform',
        {
          generateScopedName: '[local]--[hash:base64:5]',
          preprocessCss: (data, filename) => {
            if (!filename.endsWith('module.scss')) return '';
            return sass.renderSync({ file: filename }).css.toString('utf8');
          },
          extensions: ['.scss'],
        },
      ],
    ],
  },
};
