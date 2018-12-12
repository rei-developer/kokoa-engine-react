import React from 'react'
import { Link } from 'react-router-dom'
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
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
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
      topics.map(i => {
        return (
          <>
            <Divider />
            <ListItem
              component={Link} to={`/b/${i.boardDomain}/${i.id}`}
              className={classes.item}
              button
            >
              <ListItemAvatar>
                <Avatar src='https://material-ui.com/static/images/avatar/3.jpg'
                  className={classes.avatar}
                />
              </ListItemAvatar>
              <ListItemText
                secondary={
                  <>
                    <Typography component='span' className={classes.inline} color='textPrimary'>{i.title}</Typography>
                    {moment(i.created).format('YYYY/MM/DD HH:mm:ss')}
                  </>
                }
              />
            </ListItem>
          </>
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