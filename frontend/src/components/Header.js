import React from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import cn from 'classnames'
import PropTypes from 'prop-types'
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Button,
  Fab,
  MenuItem,
  Menu,
  Grid,
  Hidden,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Drawer
} from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import Logo from '../Logo.png'
import GirlLogo from '../GirlLogo.png'

const VERSION = 8

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    type: localStorage.mode || 'light',
    primary: {
      main: '#FFF',
      dark: '#202A37',
      contrastText: '#01CEA2'
    },
    secondary: {
      main: '#01CEA2',
      contrastText: '#FFF'
    }
  }
})

const styles = theme => ({
  root: {
    width: '100%',
    marginBottom: '1rem',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .01)'
  },
  grow: {
    flexGrow: 1
  },
  toolbar: {
    paddingLeft: 0,
    paddingRight: 0
  },
  button: {
    '&:hover': {
      background: '#F5F5F5'
    }
  },
  IconButton: {
    width: 48,
    height: 48,
    padding: 0,
    '&:hover': {
      background: '#F5F5F5'
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
    [theme.breakpoints.down('sm')]: {
      display: 'none'
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
  notice: {
    '& span': {
      backgroundColor: '#ED1C24',
      color: '#FFF'
    }
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
    position: 'fixed',
    bottom: theme.spacing.unit * 3,
    right: theme.spacing.unit * 3,
    zIndex: 200,
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  message: {
    borderBottom: '1px solid #CCC',
    background: 'yellow',
    color: 'red'
  }
})

@inject('option')
@inject('user')
@observer
class Header extends React.Component {
  state = {
    anchorEl: null,
    mobileMoreAnchorEl: null,
    left: false,
    version: 0
  }

  componentWillMount = () => {
    this.getVersion()
    this.getNotices()
    this.updateNotices()
  }

  getVersion = async () => {
    const response = await axios.get('/api/version')
    const data = await response.data
    if (data) this.setState({
      version: data.version
    }, () => {
      console.log(`backend ver: ${data.version}`)
      console.log(`frontend ver: ${VERSION}`)
    })
  }

  getNotices = async () => {
    const token = localStorage.token
    if (!token) return
    const { user } = this.props
    const response = await axios.get(
      '/api/notice',
      { headers: { 'x-access-token': token } }
    )
    const data = await response.data
    if (data.count) user.setNoticeCount(data.count)
  }

  updateNotices = () => {
    setTimeout(async () => {
      this.getNotices()
      this.updateNotices()
    }, 30000)
  }

  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleSignOut = () => {
    const { user } = this.props
    localStorage.removeItem('token')
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

  changeMode = () => {
    localStorage.mode = localStorage.mode === 'dark' ? 'light' : 'dark'
    window.location.reload()
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    })
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl, version } = this.state
    const { classes, option, user } = this.props
    const isMenuOpen = Boolean(anchorEl)
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
    const sideList = (
      <div className={classes.list}>
        <List>
          {[{
            name: '메인 페이지',
            path: '/',
          }, {
            name: '전체글',
            path: '/b/all',
          }, {
            name: '인기글',
            path: '/b/best',
          }, {
            name: '자유',
            path: '/b/talk'
          }, {
            name: '연예',
            path: '/b/girl'
          }, {
            name: '서브컬쳐',
            path: '/b/anime'
          }].map(node => (
            <>
              <ListItem button key={node.name} component={NavLink} to={node.path}>
                {node.icon && (
                  <ListItemIcon>
                    <FontAwesomeIcon icon={node.icon} />
                  </ListItemIcon>
                )}
                <ListItemText primary={node.name} />
              </ListItem>
              <Divider />
            </>
          ))}
          <ListItem button onClick={this.changeMode}>
            <ListItemText primary='색상 모드 변경' />
          </ListItem>
        </List>
      </div>
    )
    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem component={NavLink} to='/profile' onClick={this.handleMenuClose}>프로필 편집</MenuItem>
        <MenuItem onClick={this.changeMode}>색상 모드 변경</MenuItem>
        <MenuItem component={NavLink} to='/' onClick={this.handleSignOut}>로그아웃</MenuItem>
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
        <MenuItem component={NavLink} to='/notices'>
          <IconButton color='inherit' className={classes.IconButton}>
            <Badge badgeContent={user.noticeCount} color='secondary' className={user.noticeCount > 0 ? classes.notice : null}>
              <FontAwesomeIcon icon='bell' />
            </Badge>
          </IconButton>
          <p>알림</p>
        </MenuItem>
        <MenuItem onClick={this.handleProfileMenuOpen}>
          <IconButton color='inherit' className={classes.IconButton}>
            <FontAwesomeIcon icon='user' />
          </IconButton>
          <p>프로필 편집</p>
        </MenuItem>
      </Menu>
    )
    return (
      <MuiThemeProvider theme={theme}>
        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role='button'
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {sideList}
          </div>
        </Drawer>
        {VERSION < version && (<div className={classes.message}>하와와가 최신 버전이 아닙니다. 캐시를 비우고 다시 접속해주세요.</div>)}
        <AppBar position='static' className={classes.root}>
          <Grid container>
            <Hidden lgDown>
              <Grid item xs={2} />
            </Hidden>
            <Grid item xs>
              <Toolbar className={classes.toolbar}>
                <div className={classes.sectionMobile}>
                  <IconButton className={cn(classes.IconButton, classes.menuButton)} color='inherit' aria-label='Open drawer' onClick={this.toggleDrawer('left', true)}>
                    <FontAwesomeIcon icon='bars' />
                  </IconButton>
                </div>
                <NavLink to='/'>
                  <img src={option.logo === 'Logo' ? Logo : GirlLogo} alt='Logo' className={classes.title} />
                </NavLink>
                <div className={classes.sectionDesktop}>
                  <Button component={NavLink} to='/b/all' color='inherit' className={classes.button}><FontAwesomeIcon icon='comment-dots' className={classes.leftIcon} />전체글</Button>
                  <Button component={NavLink} to='/b/best' color='inherit' className={classes.button}><FontAwesomeIcon icon='star' className={classes.leftIcon} />인기글</Button>
                  <Button component={NavLink} to='/b/talk' color='inherit' className={classes.button}>자유</Button>
                  <Button component={NavLink} to='/b/girl' color='inherit' className={classes.button}>연예</Button>
                  <Button component={NavLink} to='/b/anime' color='inherit' className={classes.button}>서브컬쳐</Button>
                </div>
                <div className={classes.grow} />
                <IconButton color='inherit' className={classes.IconButton}>
                  <FontAwesomeIcon icon='search' />
                </IconButton>
                {user.isLogged ? (
                  <>
                    <div className={classes.sectionDesktop}>
                      <IconButton component={NavLink} to='/notices' color='inherit' className={classes.IconButton}>
                        <Badge badgeContent={user.noticeCount} color='secondary' className={user.noticeCount > 0 ? classes.notice : null}>
                          <FontAwesomeIcon icon='bell' />
                        </Badge>
                      </IconButton>
                      <Avatar
                        src={user.profileImageUrl}
                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                        aria-haspopup='true'
                        onClick={this.handleProfileMenuOpen}
                        className={cn(classes.avatar, classes.rightIcon)}
                      />
                    </div>
                    <div className={classes.sectionMobile}>
                      <IconButton aria-haspopup='true' onClick={this.handleMobileMenuOpen} color='inherit' className={classes.IconButton}>
                        <FontAwesomeIcon icon='ellipsis-v' />
                      </IconButton>
                    </div>
                  </>
                ) : (
                    <Button
                      component={NavLink}
                      to='/signin'
                      color='inherit'
                      className={classes.button}
                    >
                      <FontAwesomeIcon icon='sign-in-alt' className={classes.leftIcon} />
                      로그인
                    </Button>
                  )}
              </Toolbar>
            </Grid>
            <Hidden lgDown>
              <Grid item xs={2} />
            </Hidden>
          </Grid>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
        <Fab color='secondary' aria-label='Add' className={classes.fab} onClick={this.toggleDrawer('left', true)}>
          <FontAwesomeIcon icon='bars' />
        </Fab>
      </MuiThemeProvider>
    )
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Header)