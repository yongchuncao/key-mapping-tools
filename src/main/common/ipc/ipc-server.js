import {once} from '../../../common/event/event';
import ChannelServer from '../../../common/ipc/channel-server';
import LoggerFactory from '../../logger';

const logger = LoggerFactory.logger('IPCServer');

export default class IPCServer {
  constructor(onDidClientConnect) {
    this.channels = new Map();
    onDidClientConnect(({protocol, onDidClientDisconnect}) => {
      logger.info('收到来自客户端的建立连接请求，开辟连接通道成功，等待连接...');
      const onFirstMessage = once(protocol.onMessage);
      onFirstMessage(id => {
        logger.info('收到来自客户端' + id + '的连接开始建立连接...');
        let channelServer = new ChannelServer(protocol);
        this.channels.forEach((value, key, map) => channelServer.registerChannel(key, value));

        logger.info('为客户端' + id + '注册服务成功。');

        onDidClientDisconnect(() => {
          channelServer.dispose();
          channelServer = undefined;
          logger.info('释放与客户端' + id + '的连接.');
        });
        logger.info('与自客户端' + id + '成功建立连接.');
      });
    });
  }

  registerChannel(channelName, channel) {
    this.channels.set(channelName, channel);
    logger.info('注册' + channelName + '服务.');
  }
}
