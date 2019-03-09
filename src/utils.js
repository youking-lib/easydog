export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function normalizePath (path) {
  const [ns, key] = path.split('/')
  return { ns, key }
}

export function noop () {}

const sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
}

export function proxyGetter (target, key, source, sourceKey) {
  sharedPropertyDefinition.get = function () {
    return source[sourceKey]
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
