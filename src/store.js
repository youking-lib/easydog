import { forEachValue, normalizePath, proxyGetter, compose } from './utils'

export default class Store {
  constructor (options = {}) {
    
    this._state = {}
    this._module = {}

    ;([]).concat(options.modules).forEach(m => this.setModule(m))
    
    this.setPlugin([].concat(options.plugins))
  }

  setPlugin (plugins) {
    const chain = plugins.map(m => m(this))

    this._dispatch = compose(...chain)(this._dispatch)
  }

  setModule (m) {
    let ns = m.namespace
    this._module[ns] = m
    m.__dispatch = (path, ...args) => {
      const prefix = (path.indexOf('/') === -1 ? (ns + '/') : '')
      return this.dispatch(prefix + path, ...args)
    }
    m.__setState = this.setState.bind(this, m)
    
    Object.defineProperty(this._state, ns, {
      get: () => m.state
    })
  }

  getState = () => {
    return this._state
  }

  setState (module, state) {
    Object.assign(module.state, state)
  }

  _dispatch = ({ module, actionName, setState }, ...args) => {
    const action = module.actions[actionName]

    return action.call(module, { setState, dispatch: module.__dispatch }, ...args)
  }

  dispatch = (path, ...args) => {
    let { ns, key } = normalizePath(path)
    ns = this._module[ns]
    
    if (!ns) { return }
    
    return this._dispatch({
      module: ns,
      actionName: key,
      setState: ns.__setState
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
