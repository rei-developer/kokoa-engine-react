import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

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
  button: {
    margin: theme.spacing.unit
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  }
})

class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { classes } = this.props
    return (
      <MuiThemeProvider theme={theme}>
        <Button variant='contained' color='primary'>
          테스트
          <CloudUploadIcon className={classes.rightIcon} />
        </Button>
      </MuiThemeProvider>
    )
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Home)