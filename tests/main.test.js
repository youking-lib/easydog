import { assert, expect } from 'chai'
import { createStore } from '../dist/index.esm'
import transitModule from './examples/transitModule'
import walkModule from './examples/walkModule'
import drivingModule from './examples/drivingModule'


describe("store: ", () => {
  let store = null
  
  it("create with no error", () => {
    store = createStore({
      modules: [transitModule, drivingModule, walkModule],
      plugins: []
    })
  })
  
  let actions = null
  it("map action witch no error", () => {
    actions = store.mapActions({
      getTransits: 'transitModule/getTransits',
      getWalks: 'walkModule/getWalks'
    })
    console.log('actions', actions)

    expect(actions).keys(['getTransits', 'getWalks'])
  })
  
  let state = null
  it("map state witch no error", () => {
    state = store.mapStates({
      transits: 'transitModule/transits'
    })
    console.log(state)
    expect(state).keys(['transits'])
    assert(state.transits === null)
  })
  
  it("state should changed", () => {
    state = store.mapStates({
      transits: 'transitModule/transits'
    })
  })
})
