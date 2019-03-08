import Module from './module'
import { forEachValue, normalizePath } from './utils'

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
    forEachValue(map, (path, fname) => {
      const { ns, key } = normalizePath(path);
      res[fname] = (...args) => {
        const m = this._module[ns]

        if (!m) { return }
        const action = m.actions[key]
        return action.apply(m, args)
      }
    })
    return res
  }

  mapStates = map => {
    let res= {}
    
    forEachValue(map, (path, fname) => {
      const { ns, key } = normalizePath(path);
      const m = this._module[ns]

      if (!m) { return }
      
      res[fname] = m.state[key]
    })
    return res
  }
}
