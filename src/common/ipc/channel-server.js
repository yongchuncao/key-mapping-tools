export default class ChannelServer {
  constructor(protocol) {
    this.protocol = protocol;
    this.channels = new Map();
    this.protocolListener = this.protocol.onMessage(msg => this.onHandlerRequest(msg));
    this.activeRequests = new Map();
  }

  registerChannel(channelName, channel) {
    this.channels.set(channelName, channel);
  }

  onHandlerRequest(msg) {
    const request = JSON.parse(msg);
    switch (request.type) {
      case 'Promise':
        this.onPromise(request);
        break;
      case 'Eventlisten':
        this.onEventListen(request);
        break;
      case 'PromiseCancel':
      case 'EventDispose':
        this.disposeActiveRequest(request);
        break;
    }
  }

  onPromise(request) {
    let id = request.id;
    let channel = this.channels.get(request.channelName);
    let promise;
    try {
      promise = channel.call(request.command, request.args)
    } catch (e) {
      promise = Promise.reject(e);
    }

    promise.then(data => {
      this.sendResponse({id: id, data: data, type: 'PromiseSuccess'});
      this.activeRequests.delete(id);
    }).catch(data => {
      if (data instanceof Error) {
        this.sendResponse({
          id: id,
          data: {
            message: data.message,
            name: data.name,
            stack: data.stack ? (data.stack.split ? data.stack.split('\n') : data.stack) : void 0
          },
          type: 'PromiseError'
        });
      } else {
        this.sendResponse({id: id, data: data, type: 'PromiseErrorObj'});
      }
      this.activeRequests.delete(id);
    });
  }

  onEventListen(request) {
    let id = request.id;
    let channel = this.channels.get(request.channelName);
    const event = channel.listen(request.command, request.arg);
    const disposable = event(data => this.sendResponse({id: id, data: data, type: 'EventFire'}));
    this.activeRequests.set(request.id, disposable);
  }

  disposeActiveRequest(request) {
    const disposable = this.activeRequests.get(request.id);

    if (disposable) {
      if (disposable.dispose) {
        disposable.dispose();
      }
      this.activeRequests.delete(request.id);
    }
  }

  sendResponse(message) {
    try {
      this.protocol.send(message);
    } catch (err) {
      console.log(err);
      // noop
    }
  }

  dispose() {
    this.protocolListener.dispose();
    this.protocolListener = null;
  }
}
