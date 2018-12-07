import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

class SignIn extends React.Component {
  state = {
    username: '',
    password: ''
  }

  signIn = async () => {
    const { username, password } = this.state
    if (username === '' || password === '') return toast.error('빈 칸을 입력하세요.')
    const response = await axios.post(
      '/api/auth/signin',
      { username, password }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('로그인 성공')
    sessionStorage.token = data.token
  }

  signOut = () => {
    sessionStorage.removeItem('token')
  }

  getProfile = async () => {
    const token = sessionStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const response = await axios.get(
      '/api/auth/check',
      { headers: { 'x-access-token': token } }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    console.log(data)
  }

  setUsername = (e) => {
    this.setState({ username: e.target.value })
  }

  setPassword = (e) => {
    this.setState({ password: e.target.value })
  }
/*

        <InputGroup>
          <Input
            value={username}
            placeholder='Username'
            onChange={this.setUsername}
          />
        </InputGroup>
        <br />
        <InputGroup>
          <Input
            type='password'
            value={password}
            placeholder='Password'
            onChange={this.setPassword}
          />
        </InputGroup>
        <br />
        <Button
          color='primary'
          className='mr-2'
          onClick={this.signIn}
        >
          로그인
        </Button>
        <Button
          color='primary'
          onClick={this.getProfile}
        >
          get Profile
        </Button>
        <Button
          color='primary'
          className='mr-2'
          onClick={this.signOut}
        >
          로그아웃
        </Button>

        */
  render() {
    const { username, password } = this.state
    return (
      <>

      </>
    )
  }
}

export default SignIn