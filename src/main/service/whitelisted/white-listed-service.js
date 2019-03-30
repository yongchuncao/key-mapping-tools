import whiteListedDao from '../../dao/white-listed-dao';
import LoggerFactory from "../../logger";

const logger = LoggerFactory.logger('update-listed-service');

export default class WhiteListedService {
  constructor() {
    this.cacheArray = [];
  }

  start() {
    logger.info("启动白名单服务...");
    this.findAll();
  }

  async findAll() {
    this.cacheArray = [];
    let result = await whiteListedDao.findAll();
    result.forEach(value => {
      this.cacheArray.push(value);
    });
    return this.cacheArray;
  }

  stop() {
    this.cacheArray = [];
    logger.info('白名单服务已停止！');
  }

  isWhiteApp(appName) {
    return this.cacheArray.some(value => {
      return value.appName.toUpperCase().indexOf(appName.toUpperCase()) >= 0;
    });
  }

  async saveBatch(appNames) {
    let result = await whiteListedDao.saveBatch(appNames);
    result = await this.findAll();
    return result;
  }

  remove(appName) {
    let index = this.cacheArray.indexOf(appName);
    if (index >= 0) {
      this.cacheArray.splice(index, 1);
    }
    return whiteListedDao.remove(appName);
  }
}
