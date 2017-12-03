/* eslint-disable */

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = typeof process.env.PRODUCTION !== 'undefined';
const distPath = isProduction ? './dist/prod/' : './dist/dev/';

console.log((isProduction ? 'Production' : 'Test') + ' build ...');

module.exports = {
  devtool: isProduction ? 'nosources-source-map' : 'cheap-module-source-map',
  entry: {
    content: './src/content/index.js',
    popup: './src/popup/index.js',
  },
  output: {
    path: path.join(__dirname, distPath),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.jsx$|\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },
  resolve: {
    modules: [path.resolve('./src'), path.resolve('./node_modules')],
    extensions: ['.js', '.json'],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, './manifest.json'),
        to: 'manifest.json',
      },
      {
        from: path.join(__dirname, './assert'),
        to: './assert',
      },
    ]),
  ].concat(
    isProduction
      ? [
          new webpack.optimize.UglifyJsPlugin({
            beautify: false,
            comments: false,
          }),
        ]
      : []
  ),
};
