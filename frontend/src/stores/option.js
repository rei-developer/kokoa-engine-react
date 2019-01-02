import axios from 'axios'
import { observable, action } from 'mobx'

const version = 3

export default class UserStore {
  @observable isNewest = true
  @observable logo = 'Logo'
  @observable version = version

  constructor(root) {
    this.root = root
    this.getData()
  }

  getData = async () => {
    const response = await axios.get('http://hawawa.co:3000/version')
    const data = await response.data
    if (!data || data > version) this.isNewest = false
  }

  @action setLogo = (logo = 'Logo') => {
    this.logo = logo
  }
}