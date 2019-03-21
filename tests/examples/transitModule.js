import { Module } from '../../dist/index.esm'

export default class TransitModule extends Module {
  constructor (store) {
    super(store)

    this.state = {
      transits: null
    }
  }

  getTransits (setState) {
    let data = { routes: [1,2,3] }

    this.dispatch('walkModel/getWalks', {})

    setState({
      transits: data
    })
  }

  add () {
    console.log('add has been call')
  }
}