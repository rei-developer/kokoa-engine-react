import React from 'react'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import PropTypes from 'prop-types'
import Spinner from '../../components/Spinner'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import {
  Button,
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
  MenuItem
} from '@material-ui/core'
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state/index'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import { HashLoader } from 'react-spinners'
import AdminIcon from '../../images/Admin.png'
import UserIcon from '../../images/User.png'
import DefaultImage from '../../images/Default.png'
import ReplyIcon from '../../images/Reply.png'
import { toast } from 'react-toastify';

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
    },
    secondary: {
      main: '#ED1C24',
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
    padding: 0,
    cursor: 'pointer',
    '&:hover': {
      background: '#' + (localStorage.mode === 'dark' ? '363636' : 'F5F5F5')
    }
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
    width: 140
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
  notices: [],
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
    this.getNotices()
  }

  getNotices = () => {
    const token = localStorage.token
    if (!token) return
    const { page } = this.state
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.post(
        '/api/notice/list',
        { page },
        { headers: { 'x-access-token': token } }
      )
      const data = await response.data
      this.setState({
        loading: false,
        notices: data.notices ? [...data.notices] : []
      })
    })
  }

  clear = () => {
    const token = localStorage.token
    if (!token) return
    const { user } = this.props
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.delete(
        '/api/notice/clear',
        { headers: { 'x-access-token': token } }
      )
      const data = await response.data
      if (data.status === 'fail') return toast.error(data.message)
      this.setState({
        loading: false,
        notices: []
      }, () => {
        user.setNoticeCount(0)
      })
    })
  }

  readed = () => {
    const token = localStorage.token
    if (!token) return
    const { user } = this.props
    this.setState({
      loading: true
    }, async () => {
      const response = await axios.put(
        '/api/notice/readed',
        { success: true },
        { headers: { 'x-access-token': token } }
      )
      const data = await response.data
      if (data.status === 'fail') return toast.error(data.message)
      const notices = this.state.notices.map(item => {
        item.confirm = 1
        return item
      })
      this.setState({
        loading: false,
        notices
      }, () => {
        user.setNoticeCount(0)
      })
    })
  }

  view = async item => {
    this.props.history.push(`/b/${item.boardDomain}/${item.topicId}/${item.postId}`)
  }
  
  reset = () => {
    this.setState(init)
  }

  render() {
    const { classes, user } = this.props
    const { loading, notices } = this.state
    const extract = item => (
      item.map((i, index) => {
        return (
          <React.Fragment key={index}>
            <List
              className={classes.listItem}
              onClick={() => this.view(i)}
            >
              {index > 0 && (<Divider />)}
              <ListItem className={cn(classes.pl, i.confirm < 1 && classes.confirm)}>
                <ListItemAvatar>
                  <Avatar src={i.profile ? `https://hawawa.r.worldssl.net/img/${i.profile}` : DefaultImage} className={classes.avatar} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography component='span' className={classes.inline} color='textPrimary'>
                      {i.tagAuthor && (
                        <Chip
                          label={i.tagAuthor}
                          color='primary'
                          className={cn(classes.category, classes.leftIcon)}
                        />
                      )}
                      <div dangerouslySetInnerHTML={{ __html: i.content }} />
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
              </ListItem>
            </List>
          </React.Fragment>
        )
      })
    )
    return (
      <MuiThemeProvider theme={theme} className={classes.root}>
        <Button
          variant='contained'
          color='primary'
          onClick={this.clear}
          className={cn(classes.leftIcon, classes.mb)}
          color='secondary'
        >
          <FontAwesomeIcon icon='trash' className={classes.leftIcon} />
          비우기
        </Button>
        <Button
          variant='contained'
          color='primary'
          onClick={this.readed}
          className={classes.mb}
        >
          <FontAwesomeIcon icon='eye' className={classes.leftIcon} />
          전부 읽음
        </Button>
        <Card className={cn(classes.card, classes.mb)}>
          <Spinner loading={loading} />
          {extract(notices)}
        </Card>
      </MuiThemeProvider>
    )
  }
}

Lists.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Lists)