export function forEachValue (obj, fn) {
  Object.keys(obj).forEach(key => fn(obj[key], key))
}

export function normalizePath (path) {
  const [ns, key] = path.split('/')
  return { ns, key }
}
