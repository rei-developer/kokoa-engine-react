import React from 'react'
import { Link, Route } from 'react-router-dom'
import { toast } from 'react-toastify'
import cn from 'classnames'
import axios from 'axios'
import moment from 'moment'
import { TopicContent } from 'pages'
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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import { MoonLoader } from 'react-spinners'
import ImageIcon from '../../images/Image.svg'
import StarIcon from '../../images/Star.svg'
import BurnIcon from '../../images/Burn.svg'
import AdminIcon from '../../images/Admin.png'
import UserIcon from '../../images/User.png'

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
    primary: {
      main: '#3366CF',
      dark: '#002884',
      contrastText: '#fff'
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
    border: '1px solid #ecedef',
    borderRadius: 0
  },
  listItem: {
    '&:hover': {
      background: '#EBF1FC'
    }
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
    backgroundColor: theme.palette.background.default
  },
  bold: {
    fontWeight: 'bold'
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
  author: {
    width: 140
  },
  regdate: {
    width: 120
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
  pointer: {
    cursor: 'pointer'
  },
  sectionDesktop: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  sectionMobile: {
    [theme.breakpoints.up('md')]: {
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
    window.scrollTo(0, 0)
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
      item.map(i => {
        return (
          <TableRow
            key={i.id}
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
              {i.isBest > 0 && (<img src={i.isBest > 1 ? StarIcon : BurnIcon} className={classes.star} />)}
              {i.isImage > 0 && (<img src={ImageIcon} className={classes.star} />)}
              {i.title}
              {i.postsCount > 0 ? ` [${i.postsCount}]` : ''}
            </TableCell>
            <TableCell className={classes.author}>
              <img src={i.admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} />
              <strong>{i.author}</strong>
            </TableCell>
            <TableCell className={classes.regdate}>{moment(i.created).format('YYYY/MM/DD HH:mm:ss')}</TableCell>
            <TableCell className={classes.numeric}>{i.hits}</TableCell>
            <TableCell className={classes.numeric}>{i.likes}</TableCell>
          </TableRow>
        )
      })
    )
    const mobileExtract = (item, notice = false) => (
      item.map((i, index) => {
        const thumb = i.imageUrl ? i.imageUrl.match(/[0-9a-zA-Z]{7,}/g) : ''
        const ext = i.imageUrl ? i.imageUrl.match(/(\.bmp|\.png|\.jpg|\.jpeg|\.gif)/g) : ''
        return (
          <React.Fragment key={i.id}>
            {index > 0 && (<Divider />)}
            <ListItem
              onClick={e => this.handleClick(e, i.id)}
              className={cn(classes.pl, classes.listItem)}
              button
            >
              <ListItemAvatar>
                <Avatar
                  src={i.imageUrl ? `https://i.imgur.com/${thumb}s${ext}` : ''}
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
                    {i.isBest > 0 && (<img src={i.isBest > 1 ? StarIcon : BurnIcon} className={classes.star} />)}
                    {i.title}
                  </Typography>
                }
                secondary={
                  <>
                    <img src={i.admin > 0 ? AdminIcon : UserIcon} className={classes.leftMiniIcon} />
                    <strong>{i.author}</strong>
                    {' | '}
                    {moment(i.created).format('YYYY/MM/DD HH:mm:ss')}
                    {' | 조회 '}
                    {i.hits}
                    {i.postsCount > 0 ? ` | 댓글 ${i.postsCount}` : ''}
                  </>
                }
              />
            </ListItem>
          </React.Fragment>
        )
      })
    )
    const override = {
      position: 'fixed',
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
        {boardName !== '' && (
          <div className={classes.boardTitle}>
            <Chip
              color='primary'
              label={`${boardName} (${count})`}
              onClick={this.replay}
              className={classes.boardChip}
              clickable
            />
          </div>
        )}
        <Route path={`${this.props.match.url}/:id`} component={TopicContent} />
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
              label={`${boardName} (${count})`}
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