import axios from 'axios'
import { observable, action } from 'mobx'

export default class UserStore {
  @observable isLogged = false
  @observable username = ''
  @observable nickname = ''
  @observable email = ''

  constructor(root) {
    this.root = root
    this.getData()
  }

  init = () => {
    this.isLogged = false
    this.username = ''
    this.nickname = ''
    this.email = ''
  }

  getData = async () => {
    const token = sessionStorage.token
    if (!token) return
    const response = await axios.get(
      '/api/auth/check',
      { headers: { 'x-access-token': token } }
    )
    const data = await response.data
    if (data.status === 'fail') return
    this.isLogged = true
    this.username = data.user.username
    this.nickname = data.user.nickname
    this.email = data.user.email
  }

  @action signIn = () => {
    this.getData()
  }

  @action signOut = () => {
    this.init()
  }
}