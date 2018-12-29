import React from 'react'
import { Link } from 'react-router-dom'
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
import { HashLoader } from 'react-spinners'
import StarIcon from '../../images/Star.svg'
import BurnIcon from '../../images/Burn.svg'
import AdminIcon from '../../images/Admin.png'
import UserIcon from '../../images/User.png'
import DefaultImage from '../../images/Default.png'

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
      maxWidth: '100%',
      height: 'auto',
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
  loading: true,
  id: 0,
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

class Content extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {
    const id = this.props.match.params.id
    this.getTopic(id)
  }

  componentWillReceiveProps(nextProps) {
    const id = nextProps.match.params.id
    this.reset()
    this.getTopic(id)
  }

  getTopic = async (id) => {
    const response = await axios.get(`/api/topic/read/${id}`)
    const data = await response.data
    if (data.status === 'fail') return toast.error(data.message)
    this.setState({
      loading: false,
      id,
      ...data.topic
    })
  }

  handleVotes = async (flag) => {
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

  reset() {
    this.setState(init)
  }

  render() {
    const { classes } = this.props
    const { loading, id, category, author, title, content, created, isBest, isNotice, hits, likes, hates, profile, admin } = this.state
    const override = {
      position: 'absolute',
      width: '78px',
      height: '78px',
      margin: '-39px 0 0 -39px',
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
        {!loading && (
          <>
            <Card className={cn(classes.card, classes.mb)}>
              <ListItem className={classes.item}>
                <ListItemAvatar>
                  <Avatar src={profile ? profile : DefaultImage}
                    className={classes.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {isBest > 0 && (
                        <img src={isBest > 1 ? StarIcon : BurnIcon} className={classes.star} />
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
                        <img src={admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} />
                        <strong>{author}</strong>
                      </Typography>
                      {moment(created).fromNow()}
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
                  label={`좋아요 ${likes}`}
                  color='primary'
                  icon={<FontAwesomeIcon icon='thumbs-up' />}
                  className={classes.leftIcon}
                  onClick={() => this.handleVotes(true)}
                />
                <Chip
                  label={`싫어요 ${hates}`}
                  color='primary'
                  icon={<FontAwesomeIcon icon='thumbs-down' />}
                  onClick={() => this.handleVotes(false)}
                />
              </Grid>
            </Card>
            <PostLists id={id} />
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