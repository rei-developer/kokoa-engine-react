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
    padding: '10px 12px',
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

  render() {
    const { classes, user } = this.props
    const { username, password } = this.state
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
                    회원가입
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