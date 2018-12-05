import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'

class SignUp extends React.Component {
  state = {
    username: '',
    nickname: '',
    email: '',
    authCode: '',
    password: ''
  }

  accept = async () => {
    const { email } = this.state
    if (email === '') return toast.error('이메일을 입력하세요.')
    toast('이메일을 전송합니다...')
    const response = await axios.post(
      '/api/auth/accept',
      { email }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('이메일에 인증코드를 전송했습니다.')
  }

  signUp = async () => {
    const { username, nickname, email, authCode, password} = this.state
    if (username === '' || nickname === '' || email === '' || authCode === '' || password === '') return toast.error('빈 칸을 입력하세요.')
    const response = await axios.post(
      '/api/auth/signup',
      { username, nickname, email, authCode, password }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    this.props.history.push('/signin')
    toast.success('회원가입 성공')
  }

  setUsername = (e) => {
    this.setState({ username: e.target.value })
  }

  setNickname = (e) => {
    this.setState({ nickname: e.target.value })
  }

  setEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  setAuthCode = (e) => {
    this.setState({ authCode: e.target.value })
  }

  setPassword = (e) => {
    this.setState({ password: e.target.value })
  }

  render() {
    const { username, nickname, email, authCode, password } = this.state
    return (
      <>
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
            value={nickname}
            placeholder='nickname'
            onChange={this.setNickname}
          />
        </InputGroup>
        <br />
        <InputGroup>
          <Input
            type='email'
            value={email}
            placeholder='Email'
            onChange={this.setEmail}
          />
          <InputGroupAddon addonType="append">
            <Button
              color='primary'
              onClick={this.accept}
            >
              Send
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <br />
        <InputGroup>
          <Input
            type='text'
            value={authCode}
            placeholder='Auth Code'
            onChange={this.setAuthCode}
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
          onClick={this.signUp}
        >
          Sign Up
        </Button>
      </>
    )
  }
}

export default SignUp