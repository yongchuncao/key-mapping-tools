process.env.NODE_ENV = 'development';

// Install `vue-devtools`
require('electron').app.once('ready', () => {
  let installExtension = require('electron-devtools-installer');
  installExtension.default(installExtension.VUEJS_DEVTOOLS)
    .then(() => {
    })
    .catch(err => {
      console.log('Unable to install `vue-devtools`: \n', err);
    });
});

global.nodeRequire=require;
require = require('esm')(module);
module.exports = require('./main/main');
