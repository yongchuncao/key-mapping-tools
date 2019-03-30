export default {
  data() {
    return {
      curIndex: undefined,
      whiteList: [{
        index: 0,
        appName: ""
      }]
    }
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.callServer("findAll").then(data => {
        this.whiteList = data;
        this.whiteList.forEach((value, index, array) => {
          value.index = index;
        });
      });
    },
    doCurrentIndex(index) {
      this.curIndex = index;
    },
    removeItem() {
      if (this.curIndex !== undefined && this.curIndex !== null) {
        let item = this.whiteList[this.curIndex];
        this.whiteList.splice(this.curIndex, 1);
        if (item.appName && item.appName.length >= 0) {
          this.callServer("remove", item.appName);
        }
        this.curIndex = undefined;
      }
    },
    addItem() {
      this.whiteList.push({index: this.whiteList.length, appName: ""});
    },
    saveBatch() {
      let result = this.whiteList.filter(value => {
        return value.appName && value.appName.length > 0
      });
      this.callServer("saveBatch", result).then(data => {
          this.whiteList = data;
          this.whiteList.forEach((value, index, array) => {
            value.index = index;
          });
        }
      ).catch(e => {
        alert(e);
      });
    },
    callServer(command, args) {
      let channel = this.$ipcClient.getChannel("whiteListedChannel");
      return channel.call(command, args);
    }
  }
}
