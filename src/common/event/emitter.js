/**
 * 事件发射器，负责转发事件.
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

        if (cur._options && cur._options.onListenerAdd) {
          this._options.onListenerAdd(this);
        }

        let item = !args ? listener : [listener, args];
        cur._listeners.push(item);

        let result = {
          dispose: () => {
            result.dispose = () => {
            }
            if (!cur._disposed) {
              cur._listeners.splice(cur._listeners.indexOf(item), 1)
              if (cur._options && cur._options.onListenerRemove && cur._listeners.length === 0) {
                cur._options.onListenerRemove(this)
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
            listener.call(undefined, event)
          } else {
            listener[0].call(listener[1], event)
          }
        } catch (e) {
          throw e
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
