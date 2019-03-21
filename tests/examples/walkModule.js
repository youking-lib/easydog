import { Module } from '../../dist/index.esm'

export default class WalkModule extends Module {
  constructor (store) {
    super(store)

    this.state = {
      transits: null
    }
  }

  getWalks () {
    console.log('getWalks has been call')
  }
}