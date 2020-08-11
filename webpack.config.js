const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { WebpackPluginServe: Serve } = require('webpack-plugin-serve');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const babelConfig = require('./babelconfig.js');

const devServer = new Serve({
  hmr: false,
  client: { silent: true },
  middleware: (app, builtins) => {
    app.use(
      builtins.proxy(pathname => pathname !== '/wps', {
        target: 'http://localhost:4000',
      })
    );
  },
});

const common = {
  entry: {
    index: path.resolve(__dirname, 'client/index.js'),
  },
  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist/public'),
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
        test: /module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
              modules: {
                localIdentName: '[local]--[hash:base64:5]',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /(?<!module)\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { url: false },
          },
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  stats: {
    warnings: false,
    children: false,
    modules: false,
  },
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
  const plugins = [devServer].concat(common.plugins);
  const entry = {
    index: [common.entry.index, 'webpack-plugin-serve/client'],
  };

  module.exports = {
    ...common,
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
    entry,
    plugins,
  };
}
