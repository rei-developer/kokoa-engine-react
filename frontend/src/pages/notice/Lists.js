import React from 'react'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
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

  view = async item => {
    this.props.history.push(`/b/${item.boardDomain}/${item.topicId}/${item.postId}`)
  }

  delete = async item => {
    alert('미안하다 게이들아... 1월 3일 안으론 만들게 시간이 없다')
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
    const override = {
      position: 'fixed',
      width: '80px',
      height: '80px',
      margin: '-40px 0 0 -40px',
      top: '50%',
      left: '50%',
      zIndex: 50000
    }
    return (
      <MuiThemeProvider theme={theme}>
        <div className='sweet-loading' style={override}>
          <HashLoader
            sizeUnit='px'
            size={80}
            margin='2px'
            color='#4A4A4A'
            loading={loading}
          />
        </div>
        <Card className={cn(classes.card, classes.mb)}>
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