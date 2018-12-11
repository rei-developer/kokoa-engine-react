import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  Input,
  InputBase,
  InputLabel,
  TextField,
  FormControl,
  Button,
  Card,
  Grid,
  Hidden
} from '@material-ui/core'
import { observer, inject } from 'mobx-react'

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  fullWidth: {
    width: '100%'
  },
  mr: {
    marginRight: theme.spacing.unit
  },
  mb: {
    marginBottom: theme.spacing.unit
  },
  pl: {
    paddingLeft: theme.spacing.unit / 2
  },
  pr: {
    paddingRight: theme.spacing.unit / 2
  },
  card: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    borderRadius: '.25rem',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
  },
  bootstrapRoot: {
    'label + &': {
      marginTop: theme.spacing.unit * 3,
    },
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '8px 10px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)'
    },
  },
  bootstrapFormLabel: {
    fontSize: 18,
  }
})

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none')
})

@inject('user')
@observer
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

  signIn = () => {
    this.props.history.push('/signin')
  }

  signOut = () => {
    sessionStorage.removeItem('token')
  }

  signUp = async () => {
    const { username, nickname, email, authCode, password } = this.state
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
    const { classes, user } = this.props
    const { username, nickname, email, authCode, password } = this.state
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
          <Grid item xs>
            <Card className={classes.card}>
              <FormControl className={classes.mb} fullWidth>
                <InputBase
                  value={username}
                  placeholder='username'
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                  }}
                  onChange={this.setUsername}
                />
              </FormControl>
              <FormControl className={classes.mb} fullWidth>
                <InputBase
                  value={nickname}
                  placeholder='nickname'
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                  }}
                  onChange={this.setNickname}
                />
              </FormControl>
              <FormControl className={classes.mb} fullWidth>
                <InputBase
                  type='password'
                  value={password}
                  placeholder='password'
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                  }}
                  onChange={this.setPassword}
                />
              </FormControl>
              <Grid className={classes.mb} container>
                <Grid item xs={9} className={classes.pr}>
                  <InputBase
                    type='email'
                    value={email}
                    placeholder='email'
                    classes={{
                      root: classes.bootstrapRoot,
                      input: classes.bootstrapInput
                    }}
                    className={classes.fullWidth}
                    onChange={this.setEmail}
                  />
                </Grid>
                <Grid item xs={3} className={classes.pl}>
                  <Button
                    variant='contained'
                    color='primary'
                    className={classes.fullWidth}
                    onClick={this.accept}
                  >
                    전송
                  </Button>
                </Grid>
              </Grid>
              <FormControl className={classes.mb} fullWidth>
                <InputBase
                  value={authCode}
                  placeholder='auth code'
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                  }}
                  onChange={this.setAuthCode}
                />
              </FormControl>
              <FormControl fullWidth>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.signUp}
                >
                  회원가입
                </Button>
              </FormControl>
            </Card>
            {user.email}
            <Card className={classes.card}>
              <FormControl fullWidth>
                <Button
                  color='primary'
                  onClick={this.signIn}
                >
                  계정이 있으시다면 로그인하세요
                </Button>
              </FormControl>
            </Card>
          </Grid>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

SignUp.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SignUp)

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
        */