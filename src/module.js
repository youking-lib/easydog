export default class Module {
  constructor (_store, namespace) {
    if (new.target === Module) {
      throw new Error('Module 类只能继承后调用')
    }
    
    this._store = _store
    this.state = {}
    this.namespace = namespace || new.target.name
  }

  dispatch (path, ...args) {
    if (path.indexOf('/') === -1) {
      return this._store._dispatch({
        module: this,
        actionName: path,
        setState: this._setState
      }) 
    }
    // dispath 其他 module 的 action
    return this._store.dispatch(path, ...args)
  }

  _setState = state => {
    Object.assign(this.state, state)
  }
}
