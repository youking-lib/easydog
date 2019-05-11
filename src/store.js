import { forEachValue, normalizePath, proxyGetter } from './utils'

export default class Store {
  constructor (options = {}) {
    
    this._state = {}
    this._module = {}

    ;([]).concat(options.modules).forEach(m => {
      this.setModule(new m(this))
    })
  }

  setModule (m) {
    let ns = m.namespace
    
    this._module[ns] = m
    Object.defineProperty(this._state, ns, {
      get: () => m.state
    })
  }

  getState () {
    return this._state
  }

  _dispatch = ({ module, actionName, setState }, ...args) => {
    const action = module[actionName]

    return action.call(module, setState, ...args)
  }

  dispatch = (path, ...args) => {
    let { ns, key } = normalizePath(path)
    ns = this._module[ns]
    
    if (!ns) { return }
    
    return this._dispatch({
      module: ns,
      actionName: key,
      setState: ns._setState
    }, ...args)
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
