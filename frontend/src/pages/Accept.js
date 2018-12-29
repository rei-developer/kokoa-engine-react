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
    type: localStorage.mode || 'light',
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
    marginTop: '10vh'
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
class Accept extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      authCode: ''
    }
    const { option } = this.props
    option.setLogo()
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

  verify = async () => {
    const { email, authCode } = this.state
    if (email === '' || authCode === '') return toast.error('빈 칸을 입력하세요.')
    const username = this.props.match.params.username
    const response = await axios.patch(
      '/api/auth/edit/verify',
      { username, email, authCode }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    this.props.history.push('/signin')
    toast.success('이메일 인증 성공')
  }

  setEmail = (e) => {
    this.setState({ email: e.target.value })
  }

  setAuthCode = (e) => {
    this.setState({ authCode: e.target.value })
  }

  entered = (e) => {
    if (e.which === 13) this.verify()
  }

  render() {
    const { classes, user } = this.props
    const { email, authCode } = this.state
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
              <Grid className={classes.mb} container>
                <Grid item xs={9} className={classes.pr}>
                  <InputBase
                    type='email'
                    value={email}
                    placeholder='이메일'
                    classes={{
                      root: classes.bootstrapRoot,
                      input: classes.bootstrapInput
                    }}
                    className={classes.fullWidth}
                    onChange={this.setEmail}
                    onKeyPress={this.entered}
                    autoFocus
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
                  placeholder='인증 코드'
                  classes={{
                    root: classes.bootstrapRoot,
                    input: classes.bootstrapInput
                  }}
                  onChange={this.setAuthCode}
                  onKeyPress={this.entered}
                />
              </FormControl>
              <FormControl fullWidth>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.verify}
                >
                  이메일 인증
                </Button>
              </FormControl>
            </Card>
            {user.email}
          </Grid>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

Accept.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Accept)