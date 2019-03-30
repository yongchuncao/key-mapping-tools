let objc = null;
if (process.env.NODE_ENV === 'development') {
  objc = global.nodeRequire('objc');
} else {
  objc = require('objc');
}

const {NSWorkspace,js,ns} = objc;

export function getActiveApplication() {
  return NSWorkspace.sharedWorkspace().frontmostApplication();
}

export function getApplicationLocalizedName() {
  return js(getActiveApplication().localizedName());
}

export function isActive() {
  return js(getActiveApplication().isActive());
}

