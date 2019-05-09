import {ipcRenderer, remote} from 'electron';
import IPCClient from './ipc-client';
import {fromEmitter} from '../../../common/event/event';
import Protocol from '../../../common/ipc/protocol';
import assert from 'assert';

function createProtocol() {
  const onMessage = fromEmitter(ipcRenderer, 'ipc:message', (event, message) => ({event, message}));
  ipcRenderer.send('ipc:hello');
  return new Protocol(ipcRenderer, onMessage);
}

export default class ElectronIPCClient extends IPCClient {
  constructor() {
    super(createProtocol(), remote.getCurrentWindow().webContents.id);
  }

  on(channelName, event, listener) {
    assert.ok(channelName, '参数channelName禁止为null.');
    const channel = this.getChannel(channelName);
    channel.listen(event)(response => listener(response));
  }

  call(channelName, event, arg) {
    const channel = this.getChannel(channelName);
    return channel.call(event, arg);
  }
}
