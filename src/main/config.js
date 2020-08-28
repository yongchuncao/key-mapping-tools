import path from 'path';
import applicationConfigPath from 'application-config-path';

const CONFIG_PATH = applicationConfigPath('key-mapping-tools');
if (!global.APP_HOME) {
  global.APP_HOME = path.dirname(process.execPath);
}
const APP_HOME = global.APP_HOME;
const DB_PATH = path.join(CONFIG_PATH, 'data/db');

export default {
  APP_NAME: 'Store',
  APP_HOME: APP_HOME,
  CONFIG_PATH: CONFIG_PATH,
  INDEX:
    'file://' + path.join(__dirname, '..', 'renderer', 'index.html'),
  LOG_PATH:
    path.join(CONFIG_PATH, 'logs'),
  DB_PATH: DB_PATH,
  TMP_PATH:
    path.join(CONFIG_PATH, 'temp'),
  KEY_DB_FILENAME: path.join(DB_PATH, 'key.db'),
  WHITELISTED_DB_FILENAME: path.join(DB_PATH, 'whitelisted.db'),
  KEY_MAP_DEFAULT: [
    {
      sourceKey: 'control+c',
      targetKey: 'command+c'
    },
    {
      sourceKey: 'control+v',
      targetKey: 'command+v'
    },
    {
      sourceKey: 'control+x',
      targetKey: 'command+c,command+x'
    },
    {
      sourceKey: 'control+a',
      targetKey: 'command+a'
    },
    {
      sourceKey: 'control+z',
      targetKey: 'command+z'
    },
    {
      sourceKey: 'control+w',
      targetKey: 'command+w'
    },
    {
      sourceKey: 'control+f',
      targetKey: 'command+f'
    },
    {
      sourceKey: 'control+o',
      targetKey: 'command+o'
    },
    {
      sourceKey: 'control+n',
      targetKey: 'command+n'
    },
    {
      sourceKey: 'shift+delete',
      targetKey: 'command+backspace'
    }
  ],
  WHITELISTED_DEFAULT: [
    {appName: 'Microsoft Remote Desktop'},
    {appName: 'WebStorm'},
    {appName: 'Android Studio'},
    {appName: 'IntelliJ'}
  ]
};
