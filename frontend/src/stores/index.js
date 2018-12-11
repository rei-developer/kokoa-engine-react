import UserStore from './user'

class RootStore {
  constructor() {
    this.user = new UserStore(this)
  }
}

export default RootStore