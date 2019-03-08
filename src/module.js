export default class Module {
  constructor (m, _store) {
    this._store = _store
    this.state = m.state
    this.actions = m.actions
    this.namespace = m.namespace
  }

  dispatch (path, ...args) {
    let [ns, key] = path.split('/')

    if (!key) {
      key = ns
      ns = this
    } else {
      ns = this._store._module[ns]
    }

    const action = ns.actions[key]
    action.apply(ns, args)
  }

  setState (state) {
    Object.assign(this.state, state)
  }
}
