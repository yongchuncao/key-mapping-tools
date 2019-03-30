export default class UpdateChannel {
  constructor(updateService) {
    this.updateService = updateService;
  }

  call(command, args) {
    switch (command) {
      case 'checkForUpdates':
        return this.updateService.checkForUpdates();
      case 'quitAndInstall':
        return this.updateService.quitAndInstall();
    }

  }

  listen(event, args) {
    switch (event) {
      case 'error':
      case 'checking-for-update':
      case 'update-available':
      case 'update-not-available':
      case 'download-progress':
      case 'update-downloaded':
        return this.updateService.onUpdateEvent(event,args);
    }
    throw new Error('No event found');
  }
}
