export default {
  namespace: 'transitModule',
  state: {
    transits: null
  },
  actions: {
    getTransits () {
      let data = { routes: [1,2,3] }

      this.dispatch('walkModel/getWalks', {})

      this.setState({
        transits: data
      })
    },
  }
}
