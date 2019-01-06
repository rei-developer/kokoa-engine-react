import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import { TopicContent } from 'pages'
import Adsense from '../../components/Adsense'
import PropTypes from 'prop-types'
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  IconButton,
  Card,
  Button,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import { HashLoader } from 'react-spinners'
import PictureIcon from '../../images/Picture.svg'
import StarIcon from '../../images/Star.svg'
import BurnIcon from '../../images/Burn.svg'
import AdminIcon from '../../images/Admin.png'
import UserIcon from '../../images/User.png'
import DefaultImage from '../../images/Default.png'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
})

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = e => {
    this.props.onChangePage(e, 0)
  }

  handleBackButtonClick = e => {
    this.props.onChangePage(e, this.props.page - 1)
  }

  handleNextButtonClick = e => {
    this.props.onChangePage(e, this.props.page + 1)
  }

  handleLastPageButtonClick = e => {
    this.props.onChangePage(e, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1))
  }

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props
    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='First Page'
        >
          {theme.direction === 'rtl' ? <FontAwesomeIcon icon='angle-double-right' /> : <FontAwesomeIcon icon='angle-double-left' />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label='Previous Page'
        >
          {theme.direction === 'rtl' ? <FontAwesomeIcon icon='angle-right' /> : <FontAwesomeIcon icon='angle-left' />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Next Page'
        >
          {theme.direction === 'rtl' ? <FontAwesomeIcon icon='angle-left' /> : <FontAwesomeIcon icon='angle-right' />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Last Page'
        >
          {theme.direction === 'rtl' ? <FontAwesomeIcon icon='angle-double-left' /> : <FontAwesomeIcon icon='angle-double-right' />}
        </IconButton>
      </div>
    )
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions
)

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  },
  shadows: Array(25).fill('none'),
  palette: {
    type: localStorage.mode || 'light',
    primary: {
      main: '#01CEA2',
      contrastText: '#FFF'
    }
  }
})

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  mb: {
    marginBottom: theme.spacing.unit * 2
  },
  pl: {
    paddingLeft: theme.spacing.unit
  },
  card: {
    borderRadius: 4
  },
  listItem: {
    '&:hover': {
      background: '#' + (localStorage.mode === 'dark' ? '363636' : 'F5F5F5')
    }
  },
  noticeListItem: {
    background: localStorage.mode === 'dark' ? '#363636' : theme.palette.background.default
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
  boardTitle: {
    marginBottom: theme.spacing.unit * 2
  },
  boardChip: {
    paddingBottom: '3px',
    borderRadius: 0
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  tableSubject: {
    textAlign: 'center'
  },
  row: {
    backgroundColor: localStorage.mode === 'dark' ? '#363636' : theme.palette.background.default
  },
  bold: {
    fontWeight: 'bold'
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
  author: {
    width: 140
  },
  numeric: {
    width: 40,
    textAlign: 'center'
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
  },
  pointer: {
    cursor: 'pointer'
  },
  sectionDesktop: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  sectionMobile: {
    [theme.breakpoints.up('lg')]: {
      display: 'none'
    }
  }
})

const init = {
  loading: true,
  notices: [],
  topics: [],
  categories: [],
  category: '',
  count: 0,
  page: 0,
  rowsPerPage: 20,
  domain: '',
  boardName: ''
}

const timeRender = date => moment(date).format(moment(date).format('YYYYMMDD') === moment().format('YYYYMMDD') ? 'HH:mm:ss' : 'YYYY.MM.DD')

@inject('option')
@inject('user')
@observer
class Lists extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {
    const { option } = this.props
    const domain = this.props.match.params.domain
    option.setLogo(domain === 'girl' ? 'GirlLogo' : 'Logo')
    this.getBoardName(domain)
    this.getCategories(domain)
    this.getTopics(domain)
  }

  componentWillReceiveProps(nextProps) {
    const { option } = this.props
    const domain = this.props.match.params.domain
    const nextDomain = nextProps.match.params.domain
    if (domain === nextDomain) return
    option.setLogo(nextDomain === 'girl' ? 'GirlLogo' : 'Logo')
    this.reset()
    this.getBoardName(nextDomain)
    this.getCategories(nextDomain)
    this.getTopics(nextDomain)
  }

  handleClick = (e, id) => {
    this.props.history.push(`${this.props.match.url}/${id}`)
  }

  handleChangePage = (e, page) => {
    const domain = this.props.match.params.domain
    this.setState({
      page
    }, () => {
      this.getTopics(domain)
    })
  }

  handleChangeRowsPerPage = e => {
    const domain = this.props.match.params.domain
    this.setState({
      rowsPerPage: e.target.value
    }, () => {
      this.getTopics(domain)
    })
  }

  getBoardName = async (domain) => {
    const response = await axios.get(`/api/topic/boardName/${domain}`)
    const data = await response.data
    if (data.status === 'fail') return
    this.setState({
      boardName: data
    })
  }

  getCategories = async (domain) => {
    const response = await axios.get(`/api/topic/categories/${domain}`)
    const data = await response.data
    if (data.status === 'fail') return
    this.setState({
      categories: data
    })
  }

  getTopics = (domain, more = false) => {
    const { category, page, rowsPerPage } = this.state
    this.setState({
      loading: true,
      domain
    }, async () => {
      const obj = {}
      obj.domain = domain
      if (category !== '') obj.category = category
      obj.page = page
      if (rowsPerPage !== init.rowsPerPage) obj.limit = rowsPerPage
      const response = await axios.post('/api/topic/list', obj)
      const data = await response.data
      this.setState({
        loading: false,
        notices: more ? (data.notices ? [...this.state.notices, ...data.notices] : [...this.state.notices]) : (data.notices ? [...data.notices] : []),
        topics: more ? (data.topics ? [...this.state.topics, ...data.topics] : [...this.state.topics]) : (data.topics ? [...data.topics] : []),
        count: data.count
      })
    })
  }

  loadMore = () => {
    const domain = this.props.match.params.domain
    this.setState({
      page: this.state.page + 1
    }, () => {
      this.getTopics(domain, true)
    })
  }

  replay = () => {
    const { domain } = this.state
    this.setState({
      page: 0
    }, () => {
      this.getTopics(domain)
      this.props.history.push(`/b/${domain}`)
    })
  }

  reset = () => {
    this.setState(init)
  }

  render() {
    const { classes, user } = this.props
    const { loading, notices, topics, rowsPerPage, count, page, boardName } = this.state
    const domain = this.props.match.params.domain
    const desktopExtract = (item, notice = false) => (
      item.map((i, index) => {
        return (
          <TableRow
            key={index}
            selected={false}
            onClick={e => this.handleClick(e, i.id)}
            className={notice ? classes.row : null}
            hover
          >
            <TableCell className={classes.numeric}>{notice ? (<FontAwesomeIcon icon='flag' />) : i.id}</TableCell>
            <TableCell className={notice ? classes.bold : null} component='th' scope='row'>
              {i.category !== '' && (
                <Chip
                  label={i.category}
                  color='primary'
                  className={cn(classes.category, classes.leftIcon)}
                />
              )}
              {i.isBest > 0 && (<img src={i.isBest > 1 ? StarIcon : BurnIcon} className={classes.star} alt='IsBest' />)}
              {i.isImage > 0 && (<img src={PictureIcon} className={classes.star} alt='IsImage' />)}
              {i.title}
              {i.postsCount > 0 && (<span className={classes.count}>{i.postsCount}</span>)}
            </TableCell>
            <TableCell className={classes.author}>
              <img src={i.admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} alt='User' />
              <strong>{i.author}</strong>
            </TableCell>
            <TableCell className={classes.numeric}>{timeRender(i.created)}</TableCell>
            <TableCell className={classes.numeric}>{i.hits}</TableCell>
            <TableCell className={classes.numeric}>{i.likes}</TableCell>
          </TableRow>
        )
      })
    )
    const mobileExtract = (item, notice = false) => (
      item.map((i, index) => {
        return (
          <React.Fragment key={index}>
            <ListItem
              onClick={e => this.handleClick(e, i.id)}
              className={cn(classes.pl, classes.listItem, notice ? classes.noticeListItem : null)}
              button
            >
              <ListItemAvatar>
                <Avatar
                  src={i.imageUrl ? `https://hawawa.r.worldssl.net/img/thumb/${i.imageUrl}` : DefaultImage}
                  className={classes.avatar}
                />
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
                    {i.isBest > 0 && (<img src={i.isBest > 1 ? StarIcon : BurnIcon} className={classes.star} alt='IsBest' />)}
                    <span className={notice ? classes.bold : null}>{i.title}</span>
                    {i.postsCount > 0 && (<span className={classes.count}>{i.postsCount}</span>)}
                  </Typography>
                }
                secondary={
                  <>
                    <img src={i.admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} alt='User' />
                    <strong>{i.author}</strong>
                    {' | '}
                    {timeRender(i.created)}
                    {' | 조회 '}
                    {i.hits}
                  </>
                }
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        )
      })
    )
    const override = {
      position: 'fixed',
      width: '80px',
      height: '80px',
      margin: '-40px 0 0 -40px',
      top: '50%',
      left: '50%',
      zIndex: 50000
    }
    const routes = [
      `${this.props.match.url}/:id/:tag`,
      `${this.props.match.url}/:id`
    ]
    return (
      <MuiThemeProvider theme={theme} className={classes.root}>
        <div className='sweet-loading' style={override}>
          <HashLoader
            sizeUnit='px'
            size={80}
            margin='2px'
            color='#4A4A4A'
            loading={loading}
          />
        </div>
        {boardName !== '' && (
          <div className={classes.boardTitle}>
            <Chip
              color='primary'
              label={
                <>
                  <FontAwesomeIcon icon='sync-alt' className={classes.leftIcon} />
                  {`${boardName} (${count})`}
                </>
              }
              onClick={this.replay}
              className={classes.boardChip}
              clickable
            />
          </div>
        )}
        <Switch>
          {routes.map(route => (
            <Route key={route} exact path={route} component={TopicContent} />
          ))}
        </Switch>
        <Adsense />
        {boardName !== '' && (
          <div className={classes.boardTitle}>
            <Chip
              color='primary'
              label={
                <>
                  <FontAwesomeIcon icon='sync-alt' className={classes.leftIcon} />
                  {`${boardName} (${count})`}
                </>
              }
              onClick={this.replay}
              className={classes.boardChip}
              clickable
            />
          </div>
        )}
        {user.isLogged && domain !== 'all' && domain !== 'best' && (
          <div className={classes.mb}>
            <Button component={Link} to={`${this.props.match.url}/write`} variant='contained' color='primary'>
              <FontAwesomeIcon icon='pencil-alt' className={classes.leftIcon} />
              글쓰기
            </Button>
          </div>
        )}
        <Card className={cn(classes.card, classes.mb)}>
          <div className={cn(classes.sectionDesktop, classes.tableWrapper)}>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell className={classes.tableSubject}>순번</TableCell>
                  <TableCell className={classes.tableSubject}>제목</TableCell>
                  <TableCell className={classes.tableSubject}>작성자</TableCell>
                  <TableCell className={classes.tableSubject}>작성일</TableCell>
                  <TableCell className={classes.tableSubject}>조회</TableCell>
                  <TableCell className={classes.tableSubject}>추천</TableCell>
                </TableRow>
              </TableHead>
              <TableBody className={classes.pointer}>
                {desktopExtract(notices, true)}
                {desktopExtract(topics)}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[10, 20, 30, 40, 50]}
                    count={count}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActionsWrapped}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </div>
          <div className={classes.sectionMobile}>
            {mobileExtract(notices, true)}
            {mobileExtract(topics)}
            <Button onClick={this.loadMore} variant='contained' color='primary' fullWidth>
              게시물 더 불러오기
            </Button>
          </div>
        </Card>
        {boardName !== '' && (
          <div className={classes.boardTitle}>
            <Chip
              color='primary'
              label={
                <>
                  <FontAwesomeIcon icon='sync-alt' className={classes.leftIcon} />
                  {`${boardName} (${count})`}
                </>
              }
              onClick={this.replay}
              className={classes.boardChip}
              clickable
            />
          </div>
        )}
        {user.isLogged && domain !== 'all' && domain !== 'best' && (
          <div className={classes.mb}>
            <Button component={Link} to={`${this.props.match.url}/write`} variant='contained' color='primary'>
              <FontAwesomeIcon icon='pencil-alt' className={classes.leftIcon} />
              글쓰기
            </Button>
          </div>
        )}
      </MuiThemeProvider>
    )
  }
}

Lists.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Lists)