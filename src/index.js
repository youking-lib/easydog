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

    store.dispatch = compose(...chain)(store.dispatch)
    return store
  }
}
