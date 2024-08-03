
class Store {
  constructor () {
    this.state = {
      annule: 0,
      critique: 0,
      chat: 0,
      alerte: 0
    }
  }

  setStore=(key, value) => { this.state[key] = value }
  getStore=() => this.state
}

export default Store
