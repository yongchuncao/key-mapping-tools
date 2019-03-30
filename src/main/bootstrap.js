import loggerFactory from './logger';
import appContext from './app-context';
import ElectronIPCServer from './common/ipc/ipc-electron-main';
import MainService from './service';


const logger = loggerFactory.logger('bootstrap');

class Bootstrap {
  constructor() {
    this.isRuning = false;
    this.service = new MainService();
  }

  start() {
    if (this.isRuning) {
      return;
    }
    logger.info('Boot...');
    try{
      this._init();
      this.service.start();
      this.isRuning = true;
    }finally {
      logger.info('Boot Successfuly!')
    }

  }

  stop() {
    if (this.isRuning === false) {
      return;
    }
    this.service.stop();
    this.isRuning = false;
  }

  _init() {
    this.service.init();
    this._initIPCServer();
  }

  _initIPCServer() {
    logger.info('初始化 ElectronIPCServer .');
    try {
      this.electronIPCServer = new ElectronIPCServer();
      appContext.put('electronIPCServer', this.electronIPCServer);

      this.electronIPCServer.registerChannel('updateChannel', appContext.getBean('updateChannel'));
      this.electronIPCServer.registerChannel('keyMapChannel', appContext.getBean('keyMapChannel'));
      this.electronIPCServer.registerChannel('whiteListedChannel', appContext.getBean('whiteListedChannel'));
    } finally {
      logger.info('初始化 ElectronIPCServer完成.');
    }
  }
}

export default new Bootstrap();
