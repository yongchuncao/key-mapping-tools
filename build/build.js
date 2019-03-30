/**
 * 根据系统环境执行构建
 */
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const assert = require('assert');
const webpack = require('webpack');
const ora = require('ora');
const chalk = require('chalk');
const mainWebpackConfig = require('./webpack.main.config');
const renderWebpackConfig = require('./webpack.renderer.config');
const async = require('async');


function rmrfDirSync(path) {
  console.log(chalk.cyan('  Clean ' + path));
  assert.ok(path, 'The parameter path is undefined !');
  if (fs.existsSync(path)) {
    fse.removeSync(path);
  }
}

function cleanMainDir() {
  console.log(chalk.cyan('  Clean ' + mainWebpackConfig.output.path));
  rmrfDirSync(mainWebpackConfig.output.path);
}

function cleanRenderDir() {
  console.log(chalk.cyan('  Clean ' + renderWebpackConfig.output.path));
  rmrfDirSync(renderWebpackConfig.output.path);
}

function cleanPackageDir() {
  let path=path.join(__dirname, '..', 'dist/packages');
  console.log(chalk.cyan('  Clean ' + path));
  rmrfDirSync(path);
}

function buildMasterProcess(callback) {
  let spinner = ora('Build MasterProcess for production...');
  spinner.start();
  cleanMainDir();
  webpack(mainWebpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
    }
    console.log(chalk.cyan('  Build complete.\n'));
    if (callback) {
      callback();
    }
  });
}

function buildRendererProcess(callback) {
  let spinner = ora('Build rendererProcess for production...');
  spinner.start();
  cleanRenderDir();
  webpack(renderWebpackConfig, function (err, stats) {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'));
      process.exit(1);
      return;
    }
    console.log(chalk.cyan('  Build complete.\n'));
    if (callback) {
      callback();
    }
  });
}

switch (process.argv[2]) {
  case 'clean-master':
    cleanMainDir();
    break;
  case 'clean-renderer':
    cleanRenderDir();
    break;
  case 'clean-pack':
    cleanPackageDir();
    break;
  case 'clean':
    console.log(chalk.yellow('Clean'));
    cleanMainDir();
    cleanRenderDir();
    cleanPackageDir();
    break;
  case 'pack-main':
    buildMasterProcess();
    break;
  case 'pack-renderer':
    buildRendererProcess();
    break;
  case 'pack':
    async.waterfall([buildMasterProcess, buildRendererProcess], function (error, result) {
      if (error) {
        console.log(chalk.red(error));
      } else {
        console.log(chalk.cyan("Build Successfully!"));
      }
    });
    break;
  default: {
    // process.env.BUILD_TARGET = os.platform();
    //链式异步调用
    async.waterfall([buildMasterProcess, buildRendererProcess], function (error, result) {
      if (error) {
        console.log(chalk.red(error));
      } else {
        console.log(chalk.green("Build Successfully!"));
      }
    });

  }
}
