export default class Module {
  constructor (m, _store) {
    this._store = _store
    this.state = m.state
    this.actions = m.actions
    this.namespace = m.namespace
  }

  dispatch (path, ...args) {
    if (path.indexOf('/') === -1) {
      path = this.namespace + '/' + path
    }

    return this._store.dispatch(path, ...args)
  }

  setState (state) {
    Object.assign(this.state, state)
  }
}
