import React from 'react'
import axios from 'axios'
import moment from 'moment'
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
import {
  Create,
  ThumbUp,
  ThumbDown
} from '@material-ui/icons'
import { MoonLoader } from 'react-spinners'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none')
})

const styles = theme => ({
  mb: {
    marginBottom: theme.spacing.unit * 2
  },
  card: {
    borderRadius: 0,
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
  },
  item: {
    paddingLeft: '10px'
  },
  avatar: {
    width: 64,
    height: 64
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
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
  isNotice: false
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
      ...data
    })
  }

  handleLikes = async () => {
    const { id } = this.state
    if (id < 1) return
    const token = sessionStorage.token
    if (!token) return toast.error('토큰을 새로 발급하세요.')
    const response = await axios.post(
      '/api/topic/vote/topic',
      { id, likes: true },
      { headers: { 'x-access-token': token } }
    )
    const data = response.data
    if (data.status === 'fail') return toast.error(data.message)
    toast.success('투표했습니다.')
    console.log(data.move)

    switch (data.move) {
      case 'BEST':
        toast('베스트로 보냈습니다.')
        break
      case 'DELETE':
        toast('게시물이 삭제되었습니다.')
        break
    }
  }

  reset() {
    this.setState(init)
  }

  render() {
    const { classes } = this.props
    const { loading, id, boardDomain, category, author, title, content, created, likes, hates } = this.state
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
          <MoonLoader
            sizeUnit='px'
            size={60}
            margin='2px'
            color='#36D7B7'
            loading={loading}
          />
        </div>
        {!loading && (
          <>
            <Card className={classes.card}>
              <ListItem className={classes.item}>
                <ListItemAvatar>
                  <Avatar src='https://material-ui.com/static/images/avatar/3.jpg'
                    className={classes.avatar}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <>
                      {category !== '' && (
                        <Chip
                          label={category}
                          color='primary'
                          className={classes.leftIcon}
                        />
                      )}
                      {title}
                    </>
                  }
                  secondary={
                    <>
                      <Typography component='span' className={classes.inline} color='textPrimary'>{author}</Typography>
                      {moment(created).format('YYYY/MM/DD HH:mm:ss')}
                    </>
                  }
                />
              </ListItem>
              <Divider />
              <div dangerouslySetInnerHTML={{ __html: content }} />
              <Grid
                container
                justify='center'
                className={classes.mb}
              >
                <Chip
                  label={`좋아요 ${likes}`}
                  color='primary'
                  icon={<ThumbUp />}
                  className={classes.leftIcon}
                  onClick={this.handleLikes}
                />
                <Chip
                  label={`싫어요 ${hates}`}
                  color='primary'
                  icon={<ThumbDown />}
                />
              </Grid>
            </Card>
            <div className={classes.mb} />
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