import appContext from '../app-context';
import UpdateService from './update/update-service';
import UpdateChannel from './update/update-channel';
import KeyMapService from './keymap/key-map-service';
import KeyMapChannel from './keymap/key-map-channel';
import WhiteListedService from './whitelisted/white-listed-service';
import WhiteListedChannel from './whitelisted/white-listed-channel';
import loggerFactory from "../logger";

const logger = loggerFactory.logger('bootstrap');

export default class MainService {

  init() {
    this.updateService = new UpdateService();
    this.updateChannel = new UpdateChannel(this.updateService);
    appContext.put('updateService', this.updateService);
    appContext.put('updateChannel', this.updateChannel);

    this.keyMapService = new KeyMapService();
    this.keyMapChannel = new KeyMapChannel(this.keyMapService);
    appContext.put('keyMapService', this.keyMapService);
    appContext.put('keyMapChannel', this.keyMapChannel);

    this.whiteListedService = new WhiteListedService();
    this.whiteListedChannel = new WhiteListedChannel(this.whiteListedService);
    appContext.put('whiteListedService', this.whiteListedService);
    appContext.put('whiteListedChannel', this.whiteListedChannel);
  }

  start() {
    logger.info('启动主进程服务...');
    try {
      this.updateService.start();
      this.keyMapService.start();
      this.whiteListedService.start();
    } finally {
      logger.info('主进程服务已启动.');
    }
  }

  stop() {
    logger.info('停止主进程服务...');
    try {
      this.updateService.stop();
      this.keyMapService.stop();
      this.whiteListedService.stop();
    } finally {
      logger.info('主进程服务已停止.');
    }
  }

}
