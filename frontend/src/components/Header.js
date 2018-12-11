import React from 'react'
import { NavLink } from 'react-router-dom'
import cs from 'classnames'
import PropTypes from 'prop-types'
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Button,
  Fab,
  MenuItem,
  Menu,
  Grid,
  Hidden,
  Avatar
} from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import {
  Input as InputIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Star,
  Pageview
} from '@material-ui/icons'
import { observer, inject } from 'mobx-react'
import Logo from '../Logo.png'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
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
    width: '100%',
    marginBottom: '1rem',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    paddingLeft: 0,
    paddingRight: 0
  },
  button: {
    borderBottom: '2px solid transparent',
    borderRadius: '0',
    '&:hover': {
      backgroundColor: 'transparent',
      borderBottom: '2px solid ' + theme.palette.primary.main
    }
  },
  menuButton: {
    marginRight: 20
  },
  avatar: {
    width: 48,
    height: 48,
    cursor: 'pointer'
  },
  title: {
    display: 'none',
    [theme.breakpoints.down('sm')]: {
      width: 100,
      height: 20
    },
    marginTop: 4,
    marginRight: 20,
    height: 40
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
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 3,
    left: theme.spacing.unit * 3,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  }
})

@inject('user')
@observer
class Header extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleSignOut = () => {
    const { user } = this.props
    sessionStorage.removeItem('token')
    user.signOut()
    this.handleMenuClose()
    this.handleMobileMenuClose()
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
    const { classes, user } = this.props
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
        <MenuItem onClick={this.handleSignOut}>로그아웃</MenuItem>
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
      <MuiThemeProvider theme={theme}>
        <AppBar position='static' className={classes.root}>
          <Grid container>
            <Hidden mdDown>
              <Grid item xs={2} />
            </Hidden>
            <Grid item xs>
              <Toolbar className={classes.toolbar}>
                <div className={classes.sectionMobile}>
                  <IconButton className={classes.menuButton} color='inherit' aria-label='Open drawer'>
                    <MenuIcon />
                  </IconButton>
                </div>
                <NavLink to='/'>
                  <img src={Logo} alt='Logo' className={classes.title} />
                </NavLink>
                <div className={classes.sectionDesktop}>
                  <Button component={NavLink} to='/b/best' color='inherit' className={classes.button}><Star className={classes.leftIcon} />테스트1</Button>
                  <Button component={NavLink} to='/b/all' color='inherit' className={classes.button}><Pageview className={classes.leftIcon} />테스트2</Button>
                  <Button component={NavLink} to='/b/talk' color='inherit' className={classes.button}>자유</Button>
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
                </div>
                <div className={classes.grow} />
                {user.isLogged ? (
                  <>
                    <div className={classes.sectionDesktop}>
                      <IconButton color='inherit'>
                        <Badge badgeContent={17} color='secondary'>
                          <NotificationsIcon />
                        </Badge>
                      </IconButton>
                      <Avatar
                        src='https://material-ui.com/static/images/avatar/1.jpg'
                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                        aria-haspopup='true'
                        onClick={this.handleProfileMenuOpen}
                        className={cs(classes.avatar, classes.rightIcon)}
                      />
                    </div>
                    <div className={classes.sectionMobile}>
                      <IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit'>
                        <MoreIcon />
                      </IconButton>
                    </div>
                  </>
                ) : (
                  <Button
                    component={NavLink}
                    to='/signin'
                    color='inherit'
                  >
                    <InputIcon className={classes.leftIcon} />
                    로그인
                  </Button>
                )}
              </Toolbar>
            </Grid>
            <Hidden mdDown>
              <Grid item xs={2} />
            </Hidden>
          </Grid>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        <Fab color='secondary' aria-label='Add' className={classes.fab}>
          <MenuIcon />
        </Fab>
      </MuiThemeProvider>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)