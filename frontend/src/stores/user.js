import axios from 'axios'
import { observable, action } from 'mobx'

export default class UserStore {
  @observable isLogged = false
  @observable username = ''
  @observable nickname = ''
  @observable email = ''
  @observable profileImageUrl = ''
  @observable registerDate = null
  @observable blockDate = null
  @observable level = 0
  @observable exp = 0
  @observable point = 0
  @observable isAdmin = false

  constructor(root) {
    this.root = root
    this.getData()
  }

  init = () => {
    this.isLogged = false
    this.username = ''
    this.nickname = ''
    this.email = ''
    this.profileImageUrl = ''
    this.registerDate = null
    this.blockDate = null
    this.level = 0
    this.exp = 0
    this.point = 0
    this.isAdmin = false
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
    this.profileImageUrl = data.user.profileImageUrl
    this.registerDate = data.user.registerDate
    this.blockDate = data.user.blockDate
    this.level = data.user.level
    this.exp = data.user.exp
    this.point = data.user.point
    this.isAdmin = data.user.isAdmin
  }

  @action signIn = () => {
    this.getData()
  }

  @action signOut = () => {
    this.init()
  }

  @action setNickname = (nickname) => {
    this.nickname = nickname
  }

  @action setProfileImage = (url) => {
    this.profileImageUrl = url
  }
}