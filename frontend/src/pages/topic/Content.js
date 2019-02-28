import React from 'react'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import { PostLists } from 'pages'
import { toast } from 'react-toastify'
import PropTypes from 'prop-types'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import {
  Grid,
  Card,
  Button,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
  Chip
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import { BarLoader } from 'react-spinners'
import StarIcon from '../../images/Star.svg'
import BurnIcon from '../../images/Burn.svg'
import AdminIcon from '../../images/Admin.png'
import UserIcon from '../../images/User.png'
import DefaultImage from '../../images/Default.png'
import UpImage from '../../images/Up.png'
import DownImage from '../../images/Down.png'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    type: localStorage.mode || 'light',
    primary: {
      main: '#01CEA2',
      contrastText: '#FFF'
    }
  }
})

const styles = theme => ({
  mb: {
    marginBottom: theme.spacing.unit * 2
  },
  padding: {
    padding: theme.spacing.unit
  },
  content: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    '& img': {
      maxWidth: '100%',
      height: 'auto'
    },
    '& iframe': {
      maxWidth: 'calc(100vw - 1rem)',
      border: 0
    },
    [theme.breakpoints.up('sm')]: {
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2
    }
  },
  card: {
    border: '1px solid #ecedef',
    borderRadius: 0
  },
  item: {
    paddingLeft: '10px'
  },
  avatar: {
    width: 64,
    height: 64,
    padding: 2,
    background: '#FFF',
    border: '1px solid #DDD',
    borderRadius: 500,
    '& img': {
      borderRadius: 500
    }
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  leftMiniIcon: {
    marginRight: theme.spacing.unit / 2
  },
  category: {
    height: 19,
    lineHeight: 19
  },
  star: {
    width: 18,
    height: 18,
    marginRight: theme.spacing.unit / 2,
    verticalAlign: 'middle'
  }
})

const init = {
  userId: 0,
  boardDomain: '',
  originBoardDomain: '',
  category: '',
  author: '',
  title: '',
  content: '',
  ip: '',
  header: '',
  created: '',
  updated: '',
  hits: 0,
  likes: 0,
  hates: 0,
  isImage: false,
  isBest: false,
  isNotice: false,
  profile: '',
  admin: 0
}

@inject('user')
@observer
class Content extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {
    const id = this.props.match.params.id
    this.setState({
      loading: true,
      id
    }, () => {
      this.reset()
      this.getTopic(id)
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.loading && this.props.match.params.id !== nextProps.match.params.id) {
      const id = nextProps.match.params.id
      this.setState({
        loading: true,
        id
      }, () => {
        this.reset()
        this.getTopic(id)
      })
    }
  }

  getTopic = async id => {
    const { user } = this.props
    const token = localStorage.token
    const response = await axios.get(
      `/api/topic/read/${id}`,
      {
        headers: { 'x-access-token': token }
      }
    )
    const data = await response.data
    if (data.status === 'fail') return toast.error(data.message)
    this.setState({
      loading: false,
      ...data.topic
    }, () => {
      if (user.isLogged) user.setNoticeCount(data.count)
      window.scrollTo(0, 0)
    })
  }

  handleVotes = async flag => {
    const { id } = this.state
    if (id < 1) return
    const token = localStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const response = await axios.post(
      '/api/topic/vote',
      { id, likes: flag },
      { headers: { 'x-access-token': token } }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('투표했습니다.')
    if (data.move === 'BEST') toast('베스트로 보냈습니다.')
  }

  handleDelete = async () => {
    const { id } = this.state
    if (id < 1) return
    const token = localStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const response = await axios.delete(
      '/api/topic/delete',
      {
        data: { id },
        headers: { 'x-access-token': token }
      }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('삭제했습니다.')
  }

  reset() {
    this.setState(init)
  }

  render() {
    const tag = this.props.match.params.tag
    const { classes, user } = this.props
    const { loading, userId, category, author, title, content, created, isBest, hits, likes, hates, profile, admin } = this.state
    const override = {
      position: 'fixed',
      width: '100%',
      top: '0',
      zIndex: 50000
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className='sweet-loading' style={override}>
          <BarLoader
            width='100%'
            color='#01CEA2'
            loading={loading}
          />
        </div>
        {!loading && (
          <>
            <Card className={cn(classes.card, classes.mb)}>
              <ListItem className={classes.item}>
                <ListItemAvatar>
                  <Avatar src={profile ? `https://hawawa.r.worldssl.net/img/${profile}` : DefaultImage}
                    className={classes.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {isBest > 0 && (
                        <img src={isBest > 1 ? StarIcon : BurnIcon} className={classes.star} alt='IsBest' />
                      )}
                      {category !== '' && (
                        <Chip
                          label={category}
                          color='primary'
                          className={cn(classes.category, classes.leftIcon)}
                        />
                      )}
                      {title}
                    </>
                  }
                  secondary={
                    <>
                      <Typography component='span' className={classes.inline} color='textPrimary'>
                        <img src={admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} alt='User' />
                        <strong>{author}</strong>
                      </Typography>
                      {moment(created).fromNow()}
                      {' | '}
                      {`조회 ${hits}`}
                    </>
                  }
                />
              </ListItem>
              <Divider />
              <div
                dangerouslySetInnerHTML={{ __html: content }}
                className={classes.content}
              />
              <Grid
                container
                justify='center'
                className={classes.mb}
              >
                <Chip
                  label={
                    <>
                      <img src={UpImage} className={classes.leftIcon} alt='Up' />
                      {'데뷔'}
                      <div style={{ marginLeft: 4, color: 'red' }}>{likes}</div>
                    </>
                  }
                  className={classes.leftIcon}
                  onClick={() => this.handleVotes(true)}
                />
                <Chip
                  label={
                    <>
                      <img src={DownImage} className={classes.leftIcon} alt='Down' />
                      {'탈락'}
                      <div style={{ marginLeft: 4, color: 'red' }}>{hates}</div>
                    </>
                  }
                  onClick={() => this.handleVotes(false)}
                />
              </Grid>
            </Card>
            {user.isLogged && (user.isAdmin || user.id === userId) && (
              <div className={classes.mb}>
                <Button onClick={this.handleDelete} variant='contained' color='primary'>
                  삭제
                </Button>
              </div>
            )}
            <PostLists
              id={this.state.id}
              tag={tag}
              topicUserId={userId}
            />
          </>
        )}
      </MuiThemeProvider>
    )
  }
}

Content.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Content)