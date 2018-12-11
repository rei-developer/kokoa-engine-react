import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  InputBase,
  FormControl,
  Button,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  Grid,
  Hidden,
  Divider
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import AdminIcon from '../images/Admin.png'
import UserIcon from '../images/User.png'

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
  item: {
    paddingTop: 0,
    paddingLeft: 0
  },
  avatar: {
    width: 48,
    height: 48
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
  },
  leftMiniIcon: {
    marginRight: theme.spacing.unit / 2
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
class Profile extends React.Component {
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
              <ListItem className={classes.item}>
                <ListItemAvatar>
                  <Avatar src='https://material-ui.com/static/images/avatar/3.jpg' className={classes.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <img src={user.isAdmin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} />
                      {user.username}
                    </>
                  }
                  secondary={user.email}
                />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon='user' />
                </ListItemIcon>
                <ListItemText primary={user.username} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemIcon>
                  <FontAwesomeIcon icon='pencil-alt' />
                </ListItemIcon>
                <ListItemText primary={user.nickname} />
              </ListItem>
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
          </Grid>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
        </Grid>
      </MuiThemeProvider>
    )
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Profile)