import {keyTap, keyToggle} from 'robotjs';
import keyMapDao from '../../dao/key-map-dao';
import {globalShortcut} from 'electron';
import LoggerFactory from '../../logger';
import {getApplicationLocalizedName} from "../../common/util/darwin-util";
import appContext from '../../app-context';

const logger = LoggerFactory.logger("key-map-service");

export default class KeyMapService {
  constructor() {
    this.keyMapConfig = [];
    this.currentApp = getApplicationLocalizedName();
    this.monitor = null;
  }

  start() {
    logger.info('启动按键转换服务...');
    this.whiteListedService = appContext.getBean("whiteListedService");
    this.monitor = setInterval((() => {
      let curVal = getApplicationLocalizedName();
      if (curVal === this.currentApp) {
        return;
      }
      this.currentApp = curVal;
      logger.info("currentApp " + this.currentApp);
      if (this._currentAppInWhiteListed()) {
        logger.info("unregisterAll" + this.currentApp);
        globalShortcut.unregisterAll();
      } else {
        this.registerGlobalShortcut();
      }
    }).bind(this), 300);
    logger.info('OS监视器已启动,每300毫秒扫描一次当前活跃APP...');
  }

  async registerGlobalShortcut() {
    try {
      this.keyMapConfig = await keyMapDao.findAll();
      this.keyMapConfig.forEach((item, arry, index) => {
        if (!globalShortcut.isRegistered(item.sourceKey)) {
          logger.info("register " + item.sourceKey);
          globalShortcut.register(item.sourceKey, () => this.handler(item));
        }
      });
    } catch (e) {
      logger.error(e);
    }
  }

  handler(keyMap) {
    try {
      let srckeys = keyMap.sourceKey.split('+');
      let srclastIndex = srckeys.length - 1;
      for (let i = srclastIndex; i >= 0; i--) {
        keyToggle(srckeys[i], 'up');
      }

      let htl = (keyMap) => {
        let keys = keyMap.targetKey.split('+');
        let lastIndex = keys.length - 1;
        logger.info(keyMap.sourceKey + " >> " + keyMap.targetKey);
        if (lastIndex <= 0) {
          keyTap(keys[lastIndex]);
        } else {
          keyTap(keys[lastIndex], keys.slice(0, lastIndex));
        }
      };
      setTimeout(htl.bind(this, keyMap), 100);
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * 当前应用是否在白名单中
   * @returns {boolean}
   * @private
   */
  _currentAppInWhiteListed() {
    try {
      let activeAppExePathStr = this.currentApp;
      return activeAppExePathStr && this.whiteListedService.isWhiteApp(activeAppExePathStr);
    } catch (e) {
      logger.error(e);
      return true;
    }
  }

  async updateKeyMap(keyMap) {
    try {
      let result = await keyMapDao.saveBatch(keyMap);
      if (result > 0) {
        this.keyMapConfig.forEach((value, index, array) => {
          if (value.sourceKey === keyMap.sourceKey) {
            value.targetKey = keyMap.targetKey;
          }
        });
        globalShortcut.unregisterAll();
        this.registerGlobalShortcut();
      }
      return result;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async saveKeyMap(keyMap) {
    try {
      let result = await keyMapDao.saveBatch(keyMap);
      globalShortcut.unregisterAll();
      this.registerGlobalShortcut();
      return result;
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  async findAllKeyMap() {
    return await keyMapDao.findAll();
  }

  async removeKeyMap(sourceKey) {
    try {
      let result = await keyMapDao.remove(sourceKey);
      if (result > 0) {
        let index = this.keyMapConfig.findIndex(value => {
          return value.sourceKey === sourceKey;
        });
        if (index >= 0) {
          this.keyMapConfig.splice(index, 1);
        }
        globalShortcut.unregister(sourceKey);
      }
    } catch (e) {
      logger.error(e);
      throw e;
    }
  }

  stop() {
    if (this.monitor) {
      clearInterval(this.monitor);
    }
    globalShortcut.unregisterAll();
    this.keyMapConfig = [];
  }
}
