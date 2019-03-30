export default class KeyMapChannel {
  constructor(keyMapService) {
    this.keyMapService = keyMapService;
  }

  call(command, args) {
    switch (command) {
      case 'saveKeyMap':
        return this.keyMapService.saveKeyMap(args);
      case 'removeKeyMap':
        return this.keyMapService.removeKeyMap(args);
      case 'updateKeyMap':
        return this.keyMapService.updateKeyMap(args);
      case 'findAllKeyMap':
        return this.keyMapService.findAllKeyMap();
      default:
        throw new Error("不支持的命令：" + command);

    }
  }

  listen(event,args){
    throw new Error('不支持此功能!');
  }
}
