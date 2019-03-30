'use strict';
import path from 'path';
import electron from 'electron';
import config from './config';
import LoggerFactory from './logger';
import bootstrap from './bootstrap';

let logger = LoggerFactory.logger('main');

const BrowserWindow = electron.BrowserWindow;
const app = electron.app;

let userData = path.resolve(config.CONFIG_PATH);
app.setPath('userData', userData);

//tell v8 to not be lazy when parsing JavaScript. Generally this makes startup slower
app.commandLine.appendSwitch('--js-flags', '--nolazy');

logger.info('开始启动应用程序...');
logger.info("程序安装路径：" + config.APP_HOME);
logger.info('程序配置及数据路径：' + config.CONFIG_PATH);

let mainWindow = null;
let indexUrl = config.INDEX;
if (process.env.NODE_ENV === 'development') {
  indexUrl = 'http://localhost:9080/index.html';
}

initialize();

function initialize() {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    app.quit();
    return;
  }
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  app.on("ready", () => {
    bootstrap.start();
    createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow();
    }
  });

  app.on('will-quit', () => {
    bootstrap.stop();
  });

  app.on('quit', () => {
    bootstrap.stop();
    logger.info('退出程序.');
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    show: false,
    backgroundColor: '#e3e3e3',
    // frame: false,
    webPreferences: {
      disableBlinkFeatures: 'Auxclick' // disable auxclick events (see https://developers.google.com/web/updates/2016/10/auxclick)
    },
    width: 600,
    height: 500,
    minWidth: 330,
    minHeight: 280
  });
  logger.info('开始加载页面..');
  mainWindow.loadURL(indexUrl);
  mainWindow.once('ready-to-show', () => {
    logger.info('加载页面结束,启动主窗口...');
    mainWindow.show();
    logger.info('主窗口启动成功.');
  });
  mainWindow.once('closed', () => {
    mainWindow = null;
  });
}

export {}
