import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Badge,
  Button,
  MenuItem,
  Menu
} from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Comment,
  Whatshot
} from '@material-ui/icons'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  palette: {
    primary: {
      main: '#fff',
      dark: '#fff',
      contrastText: '#3f50b5'
    },
    secondary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff'
    }
  }
})

const styles = theme => ({
  root: {
    width: '100%'
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block'
    },
    marginRight: 20
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputRoot: {
    color: 'inherit',
    width: '100%'
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex'
    }
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    marginLeft: theme.spacing.unit
  }
})

class Header extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null })
    this.handleMobileMenuClose()
  }

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget })
  }

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null })
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state
    const { classes } = this.props
    const isMenuOpen = Boolean(anchorEl)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
      </Menu>
    )

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <IconButton color='inherit'>
            <Badge badgeContent={11} color='secondary'>
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <p>Notifications</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color='inherit'>
            <AccountCircle />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    )

    return (
      <MuiThemeProvider className={classes.root} theme={theme}>
        <AppBar position='static'>
          <Toolbar>
            <IconButton className={classes.menuButton} color='inherit' aria-label='Open drawer'>
              <MenuIcon />
            </IconButton>
            <Typography className={classes.title} variant='h6' color='inherit' noWrap>
              테스트
            </Typography>
            <div className={classes.sectionDesktop}>
              <Button component={NavLink} to='/b/all' color='inherit'><Comment className={classes.leftIcon} />전체글</Button>
              <Button component={NavLink} to='/b/best' color='inherit'><Whatshot className={classes.leftIcon} />인기글</Button>
            </div>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder='Search…'
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
              />
            </div>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton color='inherit'>
                <Badge badgeContent={17} color='secondary'>
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup='true'
                onClick={this.handleProfileMenuOpen}
                color='inherit'
              >
                <AccountCircle />
              </IconButton>
            </div>
            <div className={classes.sectionMobile}>
              <IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit'>
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
      </MuiThemeProvider>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)


/*import React from 'react'
import { NavLink } from 'react-router-dom'

const Header = () => {
  const activeStyle = {
    color: 'green',
    fontSize: '2rem'
  }

  return (
    <div>
      <ul>
        <li><NavLink exact to='/' activeStyle={activeStyle}>Home</NavLink></li>
        <li><NavLink exact to='/about' activeStyle={activeStyle}>About</NavLink></li>
        <li><NavLink to='/about/foo' activeStyle={activeStyle}>About Foo</NavLink></li>
        <li><NavLink to='/b/best' activeStyle={activeStyle}>Best</NavLink></li>
        <li><NavLink to='/b/all' activeStyle={activeStyle}>All</NavLink></li>
        <li><NavLink to='/b/notice' activeStyle={activeStyle}>Notice</NavLink></li>
        <li><NavLink to='/b/talk' activeStyle={activeStyle}>Talk</NavLink></li>
        <li><NavLink to='/signin' activeStyle={activeStyle}>SignIn</NavLink></li>
        <li><NavLink to='/signup' activeStyle={activeStyle}>SignUp</NavLink></li>
      </ul>
      <hr />
    </div>
  )
}

export default Header*/