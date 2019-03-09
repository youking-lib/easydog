import Module from './module'
import { forEachValue, normalizePath, proxyGetter } from './utils'

export default class Store {
  constructor (options = {}) {
    
    this._module = {}
    this.setModules(options.modules);
  }

  setModules (modules) {
    [].concat(modules).forEach(m => {
      this._module[m.namespace] = new Module(m, this)
    })
  }

  mapActions = map => {
    let res = {}
    forEachValue(map, (path, fkey) => {
      let fn
      
      if (typeof path === 'function') {
        fn = (...args) => {
          path(this.dispatch, ...args)
        }
      } else {
        fn = (...args) => {
          this.dispatch(path, ...args)
        }
      }
      
      res[fkey] = fn
    })
    return res
  }

  dispatch = (path, ...args) => {
    let { ns } = normalizePath(path);
    ns = this._module[ns]

    if (!ns) { return }

    return ns.dispatch(path, ...args)
  }

  mapStates = map => {
    let res= {}
    
    forEachValue(map, (path, fkey) => {
      const { ns, key } = normalizePath(path);
      const m = this._module[ns]

      if (!m) { return }
      
      proxyGetter(res, fkey, m.state, key)
    })
    return res
  }
}
