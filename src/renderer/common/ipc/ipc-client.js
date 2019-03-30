import ChannelClient from '../../../common/ipc/channel-client';

export default class IPCClient {
  constructor(protocol, id) {
    this.protocol = protocol;
    this.protocol.send(id);
    this.channelClient = new ChannelClient(protocol);
  }

  getChannel(channelName) {
    return this.channelClient.getChannel(channelName);
  }

  dispose() {
    this.channelClient.dispose();
    this.channelClient = null;
  }
}
