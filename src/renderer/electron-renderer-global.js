/**
 electron渲染进程的全局对象。例如IPC通道这种，全局类对象。
 一个html引入一个
 */
import ElectronIPCClient from './common/ipc/ipc-electron-renderer';

let ipcClient = new ElectronIPCClient();
export default function install(Vue) {
  Vue.prototype.$ipcClient = ipcClient;
};
