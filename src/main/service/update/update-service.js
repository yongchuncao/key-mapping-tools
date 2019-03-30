import LoggerFactory from '../../logger';
import {fromEmitter} from "../../../common/event/event";
import schedule from 'node-schedule';
import {autoUpdater} from 'electron-updater';
import assert from 'assert';

const logger = LoggerFactory.logger('update-service');

export default class UpdateService {
  constructor() {
    this.isRuning = false;
    this.job = null;
  }

  onUpdateEvent(event, args) {
    return fromEmitter(autoUpdater, event, data => data);
    ;
  }

  start() {
    logger.info('启动自动更新服务...');
    if (this.isRuning) {
      logger.info('自动更新服务为单例，不可重复启动忽略！');
      return;
    }
    // //程序启动时，30秒后启动自动更新
    // let execTime = new Date();
    // execTime.setSeconds(execTime.getSeconds() + 30);
    // this.scheduleCheckForUpdates(execTime);
    // logger.info('自动更新服务已启动，30秒后检查更新.');

    //启动定时更新，每个1个小时检查一次更新
    this.scheduleCheckForUpdates('* * 1 * * * *');
    this.isRuning = true;
    logger.info('启动定时更新任务，每隔1小时检查一次更新.');
  }

  async scheduleCheckForUpdates(cron) {
    assert.ok(cron, 'Cron表达式不能为空!');
    this.job = schedule.scheduleJob(cron, function (service) {
        service.checkForUpdates();
      }.bind(null, this)
    );
  }

  async checkForUpdates() {
    logger.info("自动更新暂时未实现。");
    // autoUpdater.checkForUpdates();
  }

  async quitAndInstall() {
    autoUpdater.quitAndInstall();
  }

  stop() {
    if (this.job === null || this.isRuning === false) {
      return;
    }
    this.job.cancel();
    this.isRuning = false;
    logger.info('自动更新服务已停止！');
  }

}
