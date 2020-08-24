import Emitter from './emitter';

/**
 * 将emitter事件源中的eventName事件，包装成一个我们自己的事件发射器（Emitter）,并返回发射器的事件监听器.
 * 在emitter触发eventName事件时，我们自己包装的发射向所有发射器的听众们，广播此eventName事件。
 * @param emitter 必须是一个{@link Electron.EventEmitter}类的实例。
 * @param eventName
 * @param map 这是一个map函数，用来从emitter的eventName事件中取值
 * @returns 返回一个发射器的监听器，可以  on(Function)
 */
export function fromEmitter(emitter, eventName, map) {
  const fn = (...args) => result.fire(map(...args));
  const onListenerAdd = () => emitter.on(eventName, fn);
  const onListenerRemove = () => emitter.removeListener(eventName, fn);
  const result = new Emitter({onListenerAdd, onListenerRemove});
  return result.event;
}

/**
 * 将event事件函数重新包装成一个新的函数，这个新函数调用map回调函数，然后使用map的结果作为新函数的回调函数的参数。例如：
 *
 * @param event
 * @param map
 * @returns {function(*, *=): *}
 */
export function mapEvent(event, map) {
  return (listener, thisArgs) => event(i => listener.call(thisArgs, map(i)), null);
}

/**
 * 将event事件函数，包装一个具有filter过滤功能的新函数。使得event事件只接受，符合filter条件的事件。
 * @param event
 * @param filter
 * @returns {function(*, *=)}
 */
export function filterEvent(event, filter) {
  return (listener, thisArgs) => {
    event(e => filter(e) && listener.call(thisArgs, e), null);
  };
}

/**
 * 仅仅执行一次的函数
 * @param event 一个Emitter类生成的事件函数
 * @returns {function(*, *=): *}
 */
export function once(event) {
  return (listener, thisArgs = null) => {
    const result = event(e => {
      result.dispose();
      return listener.call(thisArgs, e);
    }, null);
    return result;
  };
}

