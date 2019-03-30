import path from 'path';
import fse from 'fs-extra';
import config from './config';
import log4js from 'log4js';

if (!fse.existsSync(config.LOG_PATH)) {
  fse.mkdirpSync(config.LOG_PATH);
}

log4js.configure({
  appenders: {
    fileAppender: {
      type: 'file',
      filename: path.join(config.LOG_PATH, 'all.log'),
      maxLogSize: 10485760,
      backups: 100,
      layout: {
        type: 'pattern',
        pattern: '%d %p %c - %m'// nodejs
      }
    },
    console: {
      type: 'console'
    }
  },
  categories: {
    default: {
      appenders: [
        'fileAppender', 'console'
      ],
      level: 'debug'
    }
  }
});

export default {
  logger: function (name) {
    return log4js.getLogger(name);
  }
};
