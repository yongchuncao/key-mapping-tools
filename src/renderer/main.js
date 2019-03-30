import Vue from 'vue';
import App from './app.vue';
import Icon from 'vue-awesome/components/Icon.vue';
import ElectronIPCClient from './electron-renderer-global';
import router from './router';

// 仅引入用到的图标以减小打包体积
import 'vue-awesome/icons';
import VueElectron from 'vue-electron';

// 全局注册（在 `main .js` 文件中）
Vue.component('fa-icon', Icon);
//vue的electron插件，将electron api对象整合到vue中，可以直接$electron.remote调用，无需 const electron=require('electron')
Vue.use(VueElectron);
Vue.use(ElectronIPCClient);

/**屏蔽生产环境的提示*/
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
