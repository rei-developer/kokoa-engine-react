import React from 'react'
import ReactDOM from 'react-dom'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import { toast } from 'react-toastify'
import Spinner from '../../components/Spinner'
import { PostWrite } from 'pages'
import PropTypes from 'prop-types'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import {
  IconButton,
  Chip,
  Card,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  Typography,
  Divider,
  Menu,
  MenuItem,
  Collapse
} from '@material-ui/core'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import AdminIcon from '../../images/Admin.png'
import UserIcon from '../../images/User.png'
import DefaultImage from '../../images/Default.png'
import ReplyIcon from '../../images/Reply.png'

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
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  mb: {
    marginBottom: theme.spacing.unit * 2
  },
  pl: {
    paddingLeft: theme.spacing.unit
  },
  reply: {
    paddingLeft: theme.spacing.unit * 2,
    background: '#FAFAFA'
  },
  confirm: {
    borderLeft: '.5rem solid #01CEA2'
  },
  avatar: {
    width: 50,
    height: 50,
    padding: 2,
    background: '#FFF',
    border: '1px solid #DDD',
    borderRadius: 500,
    '& img': {
      borderRadius: 500
    }
  },
  card: {
    border: '1px solid #ecedef',
    borderRadius: 0
  },
  listItem: {
    margin: 0,
    padding: 0
  },
  IconButton: {
    width: 48,
    height: 48
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
  boardTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  boardChip: {
    paddingBottom: '3px',
    borderRadius: 0
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  tableSubject: {
    textAlign: 'center'
  },
  row: {
    backgroundColor: theme.palette.background.default
  },
  bold: {
    fontWeight: 'bold'
  },
  category: {
    height: 19,
    lineHeight: 19
  },
  author: {
    color: '#01CEA2'
  },
  regdate: {
    width: 120
  },
  numeric: {
    width: 40,
    textAlign: 'center'
  },
  star: {
    width: 18,
    height: 18,
    marginRight: theme.spacing.unit / 2,
    verticalAlign: 'middle'
  },
  pointer: {
    cursor: 'pointer'
  },
  sectionDesktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  sectionMobile: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
})

const init = {
  loading: true,
  posts: [],
  count: 0,
  page: 0
}

const timeRender = date => moment(date).format(moment(date).format('YYYYMMDD') === moment().format('YYYYMMDD') ? 'HH:mm:ss' : 'YYYY.MM.DD')

@inject('option')
@inject('user')
@observer
class Lists extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {
    const { id } = this.props
    this.getPosts(id)
  }

  getPosts = id => {
    const { page } = this.state
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.post('/api/topic/list/post', { id, page })
      const data = await response.data
      this.setState({
        loading: false,
        posts: data.posts ? [...data.posts] : [],
        count: data.count
      }, () => {
        if (!this.someRefName) return
        const domNode = ReactDOM.findDOMNode(this.someRefName)
        window.scrollTo(0, domNode.getBoundingClientRect().top)
      })
    })
  }

  reply = async item => {
    this.setState({
      [`re${this.state.tempSelectedReplyId}`]: null,
      [`re${item.id}`]: !this.state[item.id],
      tempSelectedReplyId: item.id
    })
  }

  delete = async item => {
    const token = localStorage.token
    if (!token) return
    const { page } = this.state
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.delete(
        '/api/topic/delete/post',
        {
          data: { id: item.id, page },
          headers: { 'x-access-token': token }
        }
      )
      const data = await response.data
      if (data.status === 'fail') return toast.error(data.message)
      toast.success('댓글 삭제 성공!')
      const posts = this.state.posts.filter(post => post.id !== item.id)
      this.setState({
        loading: false,
        posts
      })
    })
  }

  handleCreate = (postsCount, posts) => {
    this.setState({
      loading: true
    }, async () => {
      this.setState({
        loading: false,
        [`re${this.state.tempSelectedReplyId}`]: null,
        posts: posts,
        count: postsCount
      })
    })
  }

  reset = () => {
    this.setState(init)
  }

  render() {
    const { id, tag, topicUserId, classes, user } = this.props
    const { loading, posts } = this.state
    const extract = item => (
      item.map((i, index) => {
        return (
          <React.Fragment key={index}>
            <List className={classes.listItem} ref={el => Number(tag) === i.id ? this.someRefName = el : null}>
              {index > 0 && (<Divider />)}
              <ListItem className={cn(classes.pl, i.tagUserId ? classes.reply : null, Number(tag) === i.id ? classes.confirm : null)}>
                {i.tagUserId && (<img src={ReplyIcon} className={classes.star} alt='Reply' />)}
                <ListItemAvatar>
                  <Avatar src={i.profile ? `https://hawawa.r.worldssl.net/img/${i.profile}` : DefaultImage} className={classes.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component='span' className={classes.inline} color='textPrimary'>
                      {i.tagUserId && (
                        <Chip
                          label={i.tagAuthor}
                          color='primary'
                          className={cn(classes.category, classes.leftIcon)}
                        />
                      )}
                      <div
                        dangerouslySetInnerHTML={{ __html: i.content }}
                        className={topicUserId === i.userId ? classes.author : null}
                      />
                    </Typography>
                  }
                  secondary={
                    <>
                      <img src={i.admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} alt='User' />
                      <strong>{i.author}</strong>
                      {' | '}
                      {timeRender(i.created)}
                    </>
                  }
                />
                {user.isLogged && (
                  <ListItemSecondaryAction>
                    <PopupState variant='popover' popupId='demo-popup-menu'>
                      {popupState => (
                        <React.Fragment>
                          <IconButton className={classes.IconButton} {...bindTrigger(popupState)}>
                            <FontAwesomeIcon icon='ellipsis-v' />
                          </IconButton>
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={() => {
                              this.reply(i)
                              popupState.close()
                            }}>
                              댓글
                            </MenuItem>
                            {user.id === i.userId && (
                              <MenuItem onClick={() => {
                                this.delete(i)
                                popupState.close()
                              }}>
                                삭제
                              </MenuItem>
                            )}
                          </Menu>
                        </React.Fragment>
                      )}
                    </PopupState>
                  </ListItemSecondaryAction>
                )}
              </ListItem>
            </List>
            <Collapse in={this.state[`re${i.id}`]} timeout='auto' unmountOnExit>
              <PostWrite
                topicId={id}
                topicUserId={topicUserId}
                postUserId={i.userId}
                postRootId={i.postRootId ? i.postRootId : i.id}
                postParentId={i.id}
                onCreate={this.handleCreate}
              />
            </Collapse>
          </React.Fragment>
        )
      })
    )
    return (
      <MuiThemeProvider theme={theme} className={classes.root}>
        <Card className={cn(classes.card, classes.mb)}>
          <Spinner loading={loading} />
          {extract(posts)}
        </Card>
        {
          user.isLogged
          ? (
            <PostWrite
              topicId={id}
              topicUserId={topicUserId}
              onCreate={this.handleCreate}
            />
          )
          : ''
        }
      </MuiThemeProvider>
    )
  }
}

Lists.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Lists)