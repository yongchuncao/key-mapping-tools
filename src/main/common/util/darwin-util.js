let objc = null;
if (process.env.NODE_ENV === 'development') {
  objc = global.nodeRequire('objc');
} else {
  objc = require('objc');
}

const {NSWorkspace, NSPasteboard, js, ns} = objc;

export function js2Native(js_obj) {
  return ns(js_obj);
}
export function native2Js(obj) {
  return js(obj);
}

export function getActiveApplication() {
  return NSWorkspace.sharedWorkspace().frontmostApplication();
}

export function getApplicationLocalizedName() {
  return js(getActiveApplication().localizedName());
}

export function getNSPasteboard() {
  return NSPasteboard.generalPasteboard();
}

export function getNSPasteboardItems() {
  return getNSPasteboard().pasteboardItems();
}

export function isActive() {
  return js(getActiveApplication().isActive());
}

