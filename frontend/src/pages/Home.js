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
import StarIcon from '../images/Star.svg'
import BurnIcon from '../images/Burn.svg'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
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
  category: {
    height: 19,
    lineHeight: 19
  },
  star: {
    width: 18,
    height: 18,
    marginRight: theme.spacing.unit / 2,
    verticalAlign: 'middle'
  },
})

class Home extends React.Component {
  state = {
    loading: true,
    topics: []
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
              className={classes.pl}
              button
            >
              <ListItemAvatar>
                <Avatar src={i.imageUrl}
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                secondary={
                  <>
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
                    {moment(i.created).format('YYYY/MM/DD HH:mm:ss')}
                  </>
                }
              />
            </ListItem>
          </React.Fragment>
        )
      })
    )
    return (
      <MuiThemeProvider theme={theme}>
        <Card>
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