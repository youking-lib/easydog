import Store from './store'

export function createStore (options) {
  return new Store(options)
}

export const loggerMiddleWare = (opt = {}) => store => dispatch => {
  return ({ module, actionName, setState }, ...args) => {
    opt.beforeDispath && opt.beforeDispath(actionName, module)

    dispatch({ module, actionName, setState: (...args) => {
      opt.beforeSetState && opt.beforeSetState(actionName, module)
      setState(...args)
      opt.afterSetState && opt.afterSetState(actionName, module)
    }}, ...args)
  }
}
