/**
 * 只负责把源码打包压缩
 *
 */
'use strict';

process.env.BABEL_ENV = 'main';

const path = require('path');

const outDir = resolve('dist/target/main');
const srcDir = resolve('src');
const mainDir = path.join(srcDir, 'main');
const {dependencies} = require('../package.json');
const webpack = require('webpack');
const BabiliWebpackPlugin = require('babili-webpack-plugin');
const chalk = require('chalk');

let production = process.env.NODE_ENV === 'production';

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const mainConfig = {
  entry: {
    main: path.join(mainDir, 'main.js')
  },
  output: {
    path: outDir,
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  node: {
    __dirname: !production,
    __filename: !production
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin()
  ],
  target: 'electron-main'
};
console.log(chalk.cyan('  NODE_ENV ' + process.env.NODE_ENV));
/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    })
  )
}
module.exports = mainConfig;
