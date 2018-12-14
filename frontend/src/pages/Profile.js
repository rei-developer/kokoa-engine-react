import React from 'react'
import axios from 'axios'
import moment from 'moment'
import cn from 'classnames'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import {
  Tooltip,
  FormControl,
  Button,
  ListItem,
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
  mt: {
    marginTop: theme.spacing.unit
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
  ptz: {
    paddingTop: 0
  },
  plz: {
    paddingLeft: 0
  },
  pz: {
    padding: 0
  },
  naked: {
    padding: 0,
    border: 0,
    fontSize: 15
  },
  card: {
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,
    borderRadius: '.25rem',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
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
    fontSize: 14,
    padding: '4px 6px',
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
  },
  file: {
    position: 'absolute',
    width: 48,
    height: 48,
    opacity: 0,
    zIndex: 5
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
    nickname: ''
  }

  imageUpload = async e => {
    const token = sessionStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const { REACT_APP_CLIENT_ID } = process.env
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('type', 'file')
    formData.append('image', file)
    toast('이미지 업로드 시도중...')
    const response = await fetch('https://api.imgur.com/3/upload.json', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Client-ID ${REACT_APP_CLIENT_ID}`
      },
      body: formData
    })
    const data = await response.json()
    if (data.success) {
      this.editByProfileImage(token, data.data.link)
    } else {
      toast.error('이미지 업로드 실패...')
    }
  }

  editByProfileImage = async (token, url) => {
    const response = await axios.patch(
      '/api/auth/edit/profile',
      { url },
      { headers: { 'x-access-token': token } }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('프로필 사진 편집 성공')
    const { user } = this.props
    user.setProfileImage(url)
  }

  edit = async () => {
    const { nickname } = this.state
    if (nickname === '') return toast.error('빈 칸을 입력하세요.')
    const token = sessionStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const response = await axios.patch(
      '/api/auth/edit',
      { nickname },
      { headers: { 'x-access-token': token } }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('프로필 편집 성공')
    const { user } = this.props
    user.setNickname(nickname)
  }

  setNickname = (e) => {
    this.setState({ nickname: e.target.value })
  }

  render() {
    const { classes, user } = this.props
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container>
          <Hidden mdDown>
            <Grid item xs={4} />
          </Hidden>
          <Grid item xs>
            <Card className={classes.card}>
              <ListItem className={cn(classes.ptz, classes.plz)}>
                <ListItemAvatar>
                  <>
                    <Tooltip title='프로필 사진 변경' placement='right'>
                      <input
                        type='file'
                        className={classes.file}
                        onChange={this.imageUpload}
                      />
                    </Tooltip>
                    <Avatar src={user.profileImageUrl} className={classes.avatar} />
                  </>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      <img src={user.isAdmin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} />
                      <input
                        placeholder={user.nickname}
                        className={classes.naked}
                        onChange={this.setNickname}
                      />
                    </>
                  }
                  secondary={user.email}
                />
              </ListItem>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='user' />
                  </Grid>
                  <Grid item>
                    {user.username}
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='calendar-alt' />
                  </Grid>
                  <Grid item>
                    {moment(user.registerDate).format('YYYY/MM/DD HH:mm:ss')}
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='seedling' />
                  </Grid>
                  <Grid item>
                    Lv. {user.level} ({user.exp} EXP)
                  </Grid>
                </Grid>
              </div>
              <Divider />
              <div className={cn(classes.mt, classes.mb)}>
                <Grid container spacing={8} alignItems='flex-end'>
                  <Grid item xs={1}>
                    <FontAwesomeIcon icon='gift' />
                  </Grid>
                  <Grid item>
                    {user.point} P
                  </Grid>
                </Grid>
              </div>
              <FormControl fullWidth>
                <Button
                  variant='contained'
                  color='primary'
                  onClick={this.edit}
                >
                  프로필 편집
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