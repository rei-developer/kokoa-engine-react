import { observable, action } from 'mobx'

export default class UserStore {
  @observable logo = 'Logo'

  constructor(root) {
    this.root = root
  }

  @action setLogo = (logo = 'Logo') => {
    this.logo = logo
  }
}