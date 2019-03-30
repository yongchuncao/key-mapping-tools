export default class WhiteListedChannel {
  constructor(whiteListedService) {
    this.whiteListedService = whiteListedService;
  }

  call(command, args) {
    switch (command) {
      case 'findAll':
        return this.whiteListedService.findAll();
      case 'remove':
        return this.whiteListedService.remove(args);
      case 'saveBatch':
        return this.whiteListedService.saveBatch(args);
      default:
        throw new Error("不支持的命令：" + command);
    }
  }

  listen(event, args) {
    throw new Error('不支持此功能!');
  }
}
