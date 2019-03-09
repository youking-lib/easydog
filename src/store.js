import Module from './module'
import { forEachValue, normalizePath, proxyGetter } from './utils'

export default class Store {
  constructor (options = {}) {
    
    this._state = {}
    this._module = {}
    this.setModules(options.modules);
  }

  setModules (modules) {
    [].concat(modules).forEach(m => {
      let ns = m.namespace
      let _m = new Module(m, this)
      
      this._module[ns] = _m
      Object.defineProperty(this._state, ns, {
        get: () => _m.state
      })
    })
  }

  getState () {
    return this._state
  }

  dispatch = (path, ...args) => {
    let { ns, key } = normalizePath(path);
    ns = this._module[ns]

    if (!ns) { return }

    let action = ns.actions[key]

    return action.call(ns, ns.state,...args)
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
