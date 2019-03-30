import {ipcMain} from 'electron';
import IPCServer from './ipc-server';
import Protocol from '../../../common/ipc/protocol';
import {fromEmitter, filterEvent, mapEvent} from '../../../common/event/event';
import LoggerFactory from "../../logger";

const logger = LoggerFactory.logger('IPCServer');

function createScopedOnMessageEvent(senderId) {
  const onMessage = fromEmitter(ipcMain, 'ipc:message', (event, message) => {
    return {event, message};
  });
  const onMessageFromSender = filterEvent(onMessage, ({event}) => event.sender.id === senderId);
  return mapEvent(onMessageFromSender, ({message}) => message);
}

function getOnDidClientConnect() {
  const onHello = fromEmitter(ipcMain, 'ipc:hello', ({sender}) => {
    logger.info("rcv ipc:hello " + sender.id);
    return sender;
  });

  return mapEvent(onHello, webContents => {
    const onMessage = createScopedOnMessageEvent(webContents.id);
    const protocol = new Protocol(webContents, onMessage,logger);
    const onDidClientDisconnect = fromEmitter(webContents, 'destroyed', () => {
    });
    return {protocol, onDidClientDisconnect};
  });
}

/**
 *electron主进程IPC通道服务端，监听来自渲染进程客户端的连接请求（hello为连接口令）。
 * 当收到hello请求，建立连接钩子，然后渲染进程首次启动会发送自己的id 的Ipc:message口令，服务端收到口令，触发连接的钩子，连接正式建立。
 * 保持每一个渲染进程建立连接状态。当渲染进程销毁时，释放连接状态。
 */
export default class ElectronIPCServer extends IPCServer {
  constructor() {
    super(getOnDidClientConnect());
  }
}
