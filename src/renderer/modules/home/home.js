export default {
  data() {
    return {
      curIndex: undefined,
      keyMaps: [
        {
          index: 0,
          sourceKey: "",
          targetKey: ""
        }
      ]
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    loadData() {
      this.callServer("findAllKeyMap").then(data => {
        this.keyMaps = data;
        this.keyMaps.forEach((value, index, array) => {
          value.index = index;
        });
      }).catch(e => {
        alert(e);
      });
    },
    recordKey(index) {
      this.curIndex = index;
    },
    addKeyMap() {
      this.keyMaps.push({index: this.keyMaps.length, sourceKey: "", targetKey: ""});
    },
    removeKeyMap() {
      if (this.curIndex !== undefined && this.curIndex !== null) {
        let item = this.keyMaps[this.curIndex];
        this.keyMaps.splice(this.curIndex, 1);
        if (item.sourceKey && item.sourceKey.length >= 0) {
          this.callServer("removeKeyMap", item.sourceKey);
        }
        this.curIndex = undefined;
      }
    },
    saveKeyMap() {
      let result = this.keyMaps.filter(value => {
        return value.sourceKey && value.sourceKey.length > 0
      });
      this.callServer("saveKeyMap", result).then(data => {
          this.keyMaps = data;
          this.keyMaps.forEach((value, index, array) => {
            value.index = index;
          });
        }
      ).catch(e => {
        alert(e);
      });
    },
    callServer(command, args) {
      let keyMapChannel = this.$ipcClient.getChannel("keyMapChannel");
      return keyMapChannel.call(command, args);
    }
  }
}
