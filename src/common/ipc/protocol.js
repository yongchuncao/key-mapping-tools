import Emitter from '../event/emitter';

/**
 * 通讯协议类:接受采用ipc:message协议头，开始的消息，并转发给监听者，并且提供发送协议头为ipc:message的消息。
 */
export default class Protocol {
  constructor(sender, onMessageEvent, logger) {
    this.sender = sender;
    this._onMessage = new Emitter();
    this.logger = logger;
    onMessageEvent(msg => {
      if (this.logger)
        this.logger.info("rcv ipc:message " + msg);
      this._onMessage.fire(msg);
    });
  }

  get onMessage() {
    return this._onMessage.event;
  }

  send(message) {
    if (this.logger) {
      this.logger.info("send " + JSON.stringify(message));
    }
    this.sender.send('ipc:message', message);
  }
}
