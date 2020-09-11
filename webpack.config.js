const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const babelConfig = require('./babelconfig.js');
const { makeWebpackEntries, generateScopedName } = require('./lib/devUtils');

const common = {
  entry: {
    'index.js': [
      path.resolve(__dirname, 'client/css/index.scss'),
      path.resolve(__dirname, 'client/lib/index.js'),
    ],
    ...makeWebpackEntries(),
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist/public/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelConfig.client,
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: {
                auto: true,
                getLocalIdent: ({ resourcePath }, _, localName) =>
                  generateScopedName(localName, resourcePath),
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: '../css/index',
          test: /(\.css|\.scss)$/,
          chunks: 'all',
          enforce: true,
        },
        vendor: {
          test: /(lodash|react|react-dom)/,
          name: 'vendors.js',
          chunks: 'all',
        },
      },
    },
  },
  stats: { warnings: false, modules: false },
};

if (process.env.ANALYZE) {
  const plugins = [new BundleAnalyzerPlugin({ openAnalyzer: false })].concat(common.plugins);
  module.exports = {
    ...common,
    mode: 'production',
    plugins,
  };
} else if (process.env.NODE_ENV === 'production') {
  module.exports = {
    ...common,
    mode: 'production',
  };
} else {
  common.entry['index.js'] = common.entry['index.js'].concat('blunt-livereload/dist/client');

  module.exports = {
    ...common,
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
  };
}
