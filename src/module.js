import { normalizePath } from './utils'

export default class Module {
  constructor (m, _store) {
    this._store = _store
    this.state = m.state
    this.actions = m.actions
    this.namespace = m.namespace
  }

  dispatch (path, ...args) {
    let action = this.actions[path]
    let ns = this

    if (!action) {
      let nskey = normalizePath(path)

      ns = nskey.ns
      path = nskey.key
      ns = this._store._module[ns]
      
      if (!ns) { return }
      
      action = ns.actions[path]
    }

    return action.call(ns, ns.state,...args)
  }

  setState (state) {
    Object.assign(this.state, state)
  }
}
