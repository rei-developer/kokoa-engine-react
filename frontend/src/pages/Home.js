import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import PropTypes from 'prop-types'
import {
  Grid,
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
import StarIcon from '../images/Star.svg'
import BurnIcon from '../images/Burn.svg'

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
    borderRadius: 3
  },
  category: {
    height: 19,
    lineHeight: 19
  },
  card: {
    border: '1px solid #ecedef',
    borderRadius: 0
  },
  listItem: {
    '&:hover': {
      background: '#EBF1FC'
    }
  },
  star: {
    width: 18,
    height: 18,
    marginRight: theme.spacing.unit / 2,
    verticalAlign: 'middle'
  },
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
    const extract = (
      topics.map((i, index) => {
        return (
          <React.Fragment key={i.id}>
            {index > 0 && (<Divider />)}
            <ListItem
              component={Link} to={`/b/${i.boardDomain}/${i.id}`}
              className={cn(classes.pl, classes.listItem)}
              button
            >
              <ListItemAvatar>
                <Avatar src={i.imageUrl} className={classes.avatar} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component='span' className={classes.inline} color='textPrimary'>
                    {i.category !== '' && (
                      <Chip
                        label={i.category}
                        color='primary'
                        className={cn(classes.category, classes.leftIcon)}
                      />
                    )}
                    {i.isBest > 0 && (<img src={i.isBest > 1 ? StarIcon : BurnIcon} className={classes.star} />)}
                    {i.title}
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
        <Card className={classes.card}>
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