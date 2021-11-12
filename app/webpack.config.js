const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: {
    index: path.resolve(__dirname, './src/index.tsx'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
            )[1];
            return `npm.${packageName.replace('@', '')}`;
          },
        },
      },
    },
  },
  devtool: 'source-map',

  resolve: {
    modules: [
      path.resolve(__dirname, '/src'),
      path.resolve(__dirname, 'node_modules/'),
    ],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss', '.css'],
  },

  module: {
    rules: [
      {
        test: /\.([jt]s)x?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.s?css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new Dotenv({
      path: '.env',
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin({
      patterns: [
        {from: './src/img/favicon.png', to: '[name][ext]'},
        {from: './src/img/*.png', to: 'img/[name][ext]'},
        {from: './src/img/*.svg', to: 'img/[name][ext]'},
      ],
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
    static: {
      directory: path.resolve(__dirname, './dist'),
    },
    port: 4040,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        secure: false,
      },
    },
  },
};
