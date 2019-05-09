/**
 * 事件Hub，负责转发事件.<br/>像一个网络分线盒Hub一样， 事件源丢进来一个事件，Emitter把这个事件变成N个转发给N个听众。
 */
export default class Emitter {

  constructor(options) {
    this._options = options;
    this._event = null;
    this._listeners = null;
    this._disposed = false;
  }

  get event() {
    if (!this._event) {
      const cur = this;
      this._event = (listener, args) => {
        if (!cur._listeners) {
          cur._listeners = [];
        }
        //在第一个监听者进来时开始监听事件源
        const firstListener = cur._listeners.length === 0;
        if (firstListener && this._options && this._options.onListenerAdd) {
          this._options.onListenerAdd(this);
        }

        let item = !args ? listener : [listener, args];
        cur._listeners.push(item);

        let result = {
          dispose: () => {
            result.dispose = () => {};
            if (!cur._disposed) {
              cur._listeners.splice(cur._listeners.indexOf(item), 1);
              //在最后一个监听者离开时删除对事件源的监听
              if (cur._options && cur._options.onListenerRemove && cur._listeners.length === 0) {
                cur._options.onListenerRemove(this);
              }
            }
          }
        };
        return result;
      }
    }
    return this._event;
  }


  fire(event) {
    if (this._listeners) {
      for (let index = 0; index < this._listeners.length; index++) {
        const listener = this._listeners[index];
        try {
          if (typeof listener === 'function') {
            listener.call(undefined, event);
          } else {
            listener[0].call(listener[1], event);
          }
        } catch (e) {
          throw e;
        }
      }

    }
  }

  dispose() {
    if (this._listeners) {
      this._listeners = null
    }
    this._disposed = true
  }
}
