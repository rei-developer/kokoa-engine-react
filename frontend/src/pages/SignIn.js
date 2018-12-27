import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  InputBase,
  FormControl,
  Button,
  Card,
  Grid,
  Hidden
} from '@material-ui/core'
import { observer, inject } from 'mobx-react'
import Logo from '../Logo.png'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    primary: {
      main: '#3366CF',
      dark: '#002884',
      contrastText: '#fff'
    }
  }
})

const styles = theme => ({
  fullWidth: {
    width: '100%'
  },
  container: {
    marginTop: '20vh'
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
  logo: {
    display: 'block',
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginBottom: theme.spacing.unit * 3
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

@inject('option')
@inject('user')
@observer
class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    const { option } = this.props
    option.setLogo()
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
    localStorage.token = data.token
    const { user } = this.props
    user.signIn()
    this.props.history.push('/')
  }

  signUp = () => {
    this.props.history.push('/signup')
  }

  setUsername = (e) => {
    this.setState({ username: e.target.value })
  }

  setPassword = (e) => {
    this.setState({ password: e.target.value })
  }

  entered = (e) => {
    if (e.which === 13) this.signIn()
  }

  render() {
    const { classes } = this.props
    const { username, password } = this.state
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container className={classes.container}>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
          <Grid item xs>
            <Link to='/'>
              <img src={Logo} alt='Logo' className={classes.logo} />
            </Link>
            <Card className={classes.card}>
              <FormControl className={classes.mb} fullWidth>
                <InputBase
                  value={username}
                  placeholder='아이디'
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                  }}
                  onChange={this.setUsername}
                  onKeyPress={this.entered}
                />
              </FormControl>
              <FormControl className={classes.mb} fullWidth>
                <InputBase
                  type='password'
                  value={password}
                  placeholder='비밀번호'
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                  }}
                  onChange={this.setPassword}
                  onKeyPress={this.entered}
                />
              </FormControl>
              <Grid container>
                <Grid item xs={6} className={classes.pr}>
                  <Button
                    variant='contained'
                    color='primary'
                    className={classes.fullWidth}
                    onClick={this.signIn}
                  >
                    로그인
                  </Button>
                </Grid>
                <Grid item xs={6} className={classes.pl}>
                  <Button
                    variant='contained'
                    color='primary'
                    className={classes.fullWidth}
                    onClick={this.signUp}
                  >
                    계정 생성
                  </Button>
                </Grid>
              </Grid>
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

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(SignIn)