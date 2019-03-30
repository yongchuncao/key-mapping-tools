import Emitter from '../event/emitter';

export default class ChannelClient {

  constructor(protocol, id) {
    this.protocol = protocol;
    this.lastRequestId = 0;
    this.handlers = new Map();
    this.protocolListener = this.protocol.onMessage(msg => this.onHandlerResponse(msg));
  }

  getChannel(channelName) {
    let call = (command, args) => this.requestServer(command, channelName, args);
    let listen = (event, args) => this.registerServerEvent(channelName, event, args);
    return {call, listen};
  }

  requestServer(command, channelName, args) {
    const id = this.lastRequestId++;
    return new Promise((resolve, reject) => {
      this.handlers.set(id,response => {
        console.log(response.message);
        let res=response.message;
        switch (res.type) {
          case 'PromiseSuccess':
            this.handlers.delete(id);
            resolve(res.data);
            break;
          case 'PromiseError':
            this.handlers.delete(id);
            const error = new Error(response.data.message);
            error.stack = response.data.stack;
            error.name = response.data.name;
            reject(error);
            break;
          case 'PromiseFail':
            this.handlers.delete(id);
            reject(response.data);
            break;
        }
      });
      const request = {id: id, type: 'Promise', channelName: channelName, command: command, args: args};
      this.sendMessage(JSON.stringify(request));
    }).catch(e => {
      this.sendMessage(JSON.stringify({id: id, type: 'PromiseCancel'}));
    });
  }

  registerServerEvent(channelName, event, args) {
    let id = this.lastRequestId++;
    const emitter = new Emitter({
      onFirstListenerAdd: () => {
        const request = {id: id, type: 'EventListen', channelName: channelName, command: event, arg: arg};
        this.sendMessage(request);
      },
      onLastListenerRemove: () => {
        this.sendMessage({id: id, type: 'EventDispose'});
      }
    });

    this.handlers.set(id, (response) => emitter.fire(response.data));
    return emitter.event;
  }

  sendMessage(message) {
    try {
      this.protocol.send(message);
    } catch (err) {
      // noop
    }
  }

  onHandlerResponse(response) {
    console.log(response.message);
    const handler = this.handlers.get(response.message.id);
    if (handler)
      handler(response);
  }

  dispose() {
    this.protocolListener.dispose();
    this.protocolListener = null;
  }
}
