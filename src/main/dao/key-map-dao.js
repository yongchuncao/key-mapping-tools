import Database from 'nedb';
import config from '../config';
import fse from 'fs-extra';
import LoggerFactory from "../logger";

const logger = LoggerFactory.logger("KeyMapDao");

class KeyMapDao {
  constructor() {
    this._init();
  }

  _init() {
    if (!fse.existsSync(config.DB_PATH)) {
      fse.mkdirpSync(config.DB_PATH);
    }
    let needInit = false;
    if (!fse.existsSync(config.KEY_DB_FILENAME)) {
      needInit = true
    }
    this.db = new Database({
      filename: config.KEY_DB_FILENAME,
      autoload: true
    });
    if (needInit) {
      this.db.insert(config.KEY_MAP_DEFAULT, function (err, doc) {
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

  async findTargetKey(conKey) {
    return await new Promise((resolve, reject) => {
      this.db.find({sourceKey: conKey}, function (error, docs) {
        if (error) {
          reject(error);
        } else {
          resolve(docs);
        }
      })
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

  async saveBatch(keyMaps) {
    this.removeAll();
    return await new Promise((resolve, reject) => {
      this.db.insert(keyMaps, function (error, newDoc) {
        if (error) {
          reject(error);
        } else {
          resolve(newDoc);
        }
      });
    });
  }

  async remove(sourceKey) {
    return await new Promise((resolve, reject) => {
      this.db.remove({sourceKey: sourceKey}, {multi: true}, function (err, numRemoved) {
        if (err) {
          reject(err);
        } else {
          resolve(numRemoved);
        }
      })
    });
  }
}

export default new KeyMapDao();
