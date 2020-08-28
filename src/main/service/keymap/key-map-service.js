import {keyTap, keyToggle} from 'robotjs';
import keyMapDao from '../../dao/key-map-dao';
import {globalShortcut} from 'electron';
import LoggerFactory from '../../logger';
import {getApplicationLocalizedName, getNSPasteboardItems,native2Js} from "../../common/util/darwin-util";
import appContext from '../../app-context';

const logger = LoggerFactory.logger("key-map-service");
const allControllerKey = ["alt", "command", "control", "shift"];
const clipKey = "command+alt+v";

export default class KeyMapService {
  constructor() {
    this.keyMapConfig = [];
    this.currentApp = getApplicationLocalizedName();
    this.monitor = null;
    this.isClip = false;
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
      this._mapKey(keyMap);
    } catch (e) {
      logger.error(e);
    }
  }

  _mapKey(keyMap) {
    let sourceKey = keyMap.sourceKey;
    let targetKey = keyMap.targetKey;
    if (sourceKey.toLowerCase() === "control+x") {
      targetKey = "command+c,command+x"
    }
    //如果当前是剪切模式且选中的是文件，那么执行command+alt+v实现剪切
    if (this.isClip && sourceKey.toLowerCase() === "control+v" && this._isPasteFile()) {
      targetKey = clipKey;
    }
    targetKey.split(',').forEach((targetKey) => this._sendKey(targetKey));
    this.isClip = keyMap.sourceKey.toLowerCase() === "control+x";
  }

  _isPasteFile() {
    return native2Js(getNSPasteboardItems()).some(item => {
      return native2Js(item.types()).some(type => {
        return type === 'public.file-url'
      });
    });
  }

  _sendKey(keyStr) {
    let modifier = [];
    let masterKey = "";
    keyStr.split('+').forEach(item => {
      if (allControllerKey.includes(item)) {
        modifier.push(item);
      } else {
        masterKey = item;
      }
    });
    keyToggle(masterKey, "down", modifier);
    keyToggle(masterKey, "up", modifier);
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
