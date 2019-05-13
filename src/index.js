import Store from './store'
import { compose } from './utils'

export function createStore (options) {
  return new Store(options)
}

export function applyMiddleware (...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = () => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }
    const api = {
      getState: store.getState,
      dispatch
    }
    const chain = middlewares.map(m => m(api))

    store._dispatch = compose(...chain)(store._dispatch)
    return store
  }
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
