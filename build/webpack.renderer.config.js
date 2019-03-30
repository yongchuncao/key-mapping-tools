/**
 * 打包渲染进程的VUE
 *
 */
'use strict';

process.env.BABEL_ENV = 'renderer';

const path = require('path');
const webpack = require('webpack');
const BabiliWebpackPlugin = require('babili-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const {dependencies} = require('../package');


const srcDir = resolve('src');
const rendererDir = path.join(srcDir, 'renderer');
const commonDir = path.join(srcDir, 'common');
const rootOutDir = resolve('dist/target');
const outDir = resolve('dist/target/renderer');
const staticDir = resolve('static');

let production = process.env.NODE_ENV === 'production';
const title = '按键转发工具';

/**
 *
 *  vue库不需要，因为.vue的文件vue-loader插件会去编译为普通的js
 * （可以理解为，vue库是各种语法糖而已，编译成普通js,vue库就没什么鸟用了）
 * ,而vue-router不一样，它是一个真正的功能库，没有它就无法实现路由功能
 * List of node_modules to include in webpack bundle
 *
 * Required for specific packages like Vue UI libraries
 * that provide pure *.vue files that need compiling
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/webpack-configurations.html#white-listing-externals
 */
let whiteListedModules = ['vue'];


function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let config = {
    entry: {
      main: path.join(rendererDir, 'main.js')
    },
    output: {
      path: outDir,
      //告诉webpack我们需要编译成Common JS2的模块化语法：modules.exports 和 require() 。因为node是用的commonJS2语法
      libraryTarget: 'commonjs2',
      // 如果是生产模式，那么就用模块级别的chunkhash（根据模块算出的hash值，不会因为修改了一个js导致所有js的文件名都变了）。
      // 如果是开发环境，那么为了保证每次修改代码，缓存都被清掉，用版本编译级别的hash。
      filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
      sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
      chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
    },
    //排除那些依赖，不要打包。
    externals: [
      ...Object.keys(dependencies || {}).filter(d => !whiteListedModules.includes(d))
    ],
    resolve: {
      alias: {
        "@": rendererDir,
        "@src": srcDir,
        vue: 'vue/dist/vue.js'
      },
      extensions: ['.js', '.vue', '.json', '.css', '.node'],
      modules: [rendererDir, commonDir, 'node_modules']
    },
    node: {
      //由于我们是在electron中运行，所以自带这两个变量，不需要webpack为我们polyfill。
      __dirname: !production,
      __filename: !production
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.html$/,
          use: 'vue-html-loader'
        },
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 10000,
              name: 'imgs/[name]--[folder].[ext]'
            }
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'media/[name]--[folder].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            query: {
              limit: 10000,
              name: 'fonts/[name]--[folder].[ext]'
            }
          }
        }
      ]
    },
    devServer: {
      port: 9080,
      contentBase: outDir,
      // serve index.html for all 404 (required for push-state)
      historyApiFallback: true
    },
    devtool: production ? 'nosources-source-map' : 'cheap-modules-eval-source-map',
    plugins: [
      new ExtractTextPlugin("styles.css"),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: path.join(rendererDir, "index.ejs"),
        chunks: ['main'],
        metadata: {
          title: title
        }
      })
    ],
    target: "electron-renderer"
  }
;

if (process.env.NODE_ENV !== 'production') {
  config.plugins.push(
    // 模块热部署，不能在生成环境使用，否则会报错:Cannot use [chunkhash] for chunk in ‘[name].[chunkhash].js’ (use [hash] instead)
    new webpack.HotModuleReplacementPlugin()
  );

  config.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${staticDir.replace(/\\/g, '\\\\')}"`
    })
  );
}

if (process.env.NODE_ENV === 'production') {
  config.devtool = '';
  config.plugins.push(
    new CopyWebpackPlugin([
      {
        from: staticDir,
        to: path.join(rootOutDir, 'static'),
        ignore: ['.*']
      }
    ]),
    new BabiliWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  );
}

module.exports = config
