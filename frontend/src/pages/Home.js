import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  Typography,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  Card,
  Avatar
} from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import { observer, inject } from 'mobx-react'
import { HashLoader } from 'react-spinners'
import StarIcon from '../images/Star.svg'
import BurnIcon from '../images/Burn.svg'
import DefaultImage from '../images/Default.png'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    type: localStorage.mode || 'light',
    primary: {
      main: '#3366CF'
    }
  }
})

const styles = theme => ({
  mb: {
    marginBottom: theme.spacing.unit * 2
  },
  pl: {
    paddingLeft: theme.spacing.unit
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
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  avatar: {
    width: 50,
    height: 50,
    padding: 2,
    background: '#FFF',
    border: '1px solid #DDD',
    borderRadius: 5,
    '& img': {
      borderRadius: 3
    }
  },
  category: {
    height: 19,
    lineHeight: 19
  },
  card: {
    border: '1px solid #' + (localStorage.mode === 'dark' ? '333' : 'ecedef'),
    borderRadius: 0
  },
  listItem: {
    '&:hover': {
      background: '#' + (localStorage.mode === 'dark' ? '363636' : 'EBF1FC')
    }
  },
  star: {
    width: 18,
    height: 18,
    marginRight: theme.spacing.unit / 2,
    verticalAlign: 'middle'
  },
  count: {
    marginLeft: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    background: '#f6f6f6',
    borderRadius: 5,
    color: '#b1b1b1',
    fontSize: 12,
    userSelect: 'none',
    whiteSpace: 'nowrap'
  }
})

@inject('option')
@observer
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      topics: []
    }
    const { option } = this.props
    option.setLogo()
  }

  componentWillMount = async () => {
    const response = await axios.get('/api/topic/list/widget')
    const data = await response.data
    this.setState({
      loading: false,
      topics: data ? [...data] : []
    })
  }

  render() {
    const { classes } = this.props
    const { loading, topics } = this.state
    const override = {
      position: 'fixed',
      width: '80px',
      height: '80px',
      margin: '-40px 0 0 -40px',
      top: '50%',
      left: '50%',
      zIndex: 50000
    }
    const extract = (
      topics.map((i, index) => {
        const thumb = i.imageUrl ? i.imageUrl.match(/[0-9a-zA-Z]{7,}/g) : ''
        const ext = i.imageUrl ? i.imageUrl.match(/(\.bmp|\.png|\.jpg|\.jpeg|\.gif)/g) : ''
        return (
          <React.Fragment key={i.id}>
            {index > 0 && (<Divider />)}
            <ListItem
              component={Link} to={`/b/${i.boardDomain}/${i.id}`}
              className={cn(classes.pl, classes.listItem)}
              button
            >
              <ListItemAvatar>
                <Avatar
                  src={i.imageUrl ? `https://i.imgur.com/${thumb}s${ext}` : DefaultImage}
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component='span' className={classes.inline} color='textPrimary'>
                    {i.boardName !== '' && (
                      <Chip
                        label={i.boardName}
                        color='primary'
                        className={cn(classes.category, classes.leftIcon)}
                      />
                    )}
                    {i.isBest > 0 && (<img src={i.isBest > 1 ? StarIcon : BurnIcon} className={classes.star} alt='IsBest' />)}
                    {i.title}
                    {i.postsCount > 0 && (<span className={classes.count}>{i.postsCount}</span>)}
                  </Typography>
                }
                secondary={moment(i.created).fromNow()}
              />
            </ListItem>
          </React.Fragment>
        )
      })
    )
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
        <Card className={cn(classes.mb, classes.card)}>
          {extract}
        </Card>
      </MuiThemeProvider>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)