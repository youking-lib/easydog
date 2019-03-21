import { Module } from '../../dist/index.esm'

export default class DrivingModule extends Module {
  constructor (store) {
    super(store)

    this.state = {
      loading: false
    }
  }

  driving (setState) {
    dispath('add')
    setState({
      loading: true
    })
  }

  add () {
    console.log('add has been call')
  }
}
