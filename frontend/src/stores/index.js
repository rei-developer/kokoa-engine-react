import OptionStore from './option'
import UserStore from './user'

class RootStore {
  constructor() {
    this.option = new OptionStore(this)
    this.user = new UserStore(this)
  }
}

export default RootStore