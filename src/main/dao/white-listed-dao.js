import Database from 'nedb';
import config from '../config';
import fse from 'fs-extra';
import LoggerFactory from "../logger";

const logger = LoggerFactory.logger("WhiteListedDao");

class WhiteListedDao {
  constructor() {
    this._init();
  }

  _init() {
    if (!fse.existsSync(config.DB_PATH)) {
      fse.mkdirpSync(config.DB_PATH);
    }
    let needInit = false;
    if (!fse.existsSync(config.WHITELISTED_DB_FILENAME)) {
      needInit = true
    }
    this.db = new Database({
      filename: config.WHITELISTED_DB_FILENAME,
      autoload: true
    });
    if (needInit) {
      this.db.insert(config.WHITELISTED_DEFAULT, function (err, doc) {
        if (err) {
          logger.error(err);
        }
      });
    }
  }

  async findAll() {
    return await new Promise((resolve, reject) => {
      this.db.find({}, function (error, docs) {
        if (error) {
          reject(error);
        } else {
          resolve(docs);
        }
      })
    });
  }

  async remove(appName) {
    return await new Promise((resolve, reject) => {
      this.db.remove({appName: appName}, {}, function (err, numRemoved) {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    });
  }

  async find(appName) {
    return await new Promise((resolve, reject) => {
      this.db.find({appName: appName}, (err, doc) => {
        if (err) {
          reject(err);
        } else {
          resolve(doc);
        }
      });
    });
  }

  async removeAll() {
    return await new Promise((resolve, reject) => {
      this.db.remove({}, {multi: true}, function (err, numRemoved) {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      });
    })
  }

  async saveBatch(array) {
    await this.removeAll();
    return new Promise((resolve, reject) => {
      this.db.insert(array, (error, doc) => {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    });
  }
}


export default new WhiteListedDao();
