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
  Chip
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { observer, inject } from 'mobx-react'
import { MoonLoader } from 'react-spinners'
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
  shadows: Array(25).fill('none')
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
  card: {
    borderRadius: '.25rem',
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)'
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

@inject('user')
@observer
class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {
    const domain = this.props.match.params.domain
    this.getBoardName(domain)
    this.getCategories(domain)
    this.getTopics(domain)
  }

  componentWillReceiveProps(nextProps) {
    const domain = this.props.match.params.domain
    const nextDomain = nextProps.match.params.domain
    if (domain === nextDomain) return
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

  getTopics = (domain) => {
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
        notices: data.notices ? [...data.notices] : [],
        topics: data.topics ? [...data.topics] : [],
        count: data.count
      })
    })
  }

  replay = () => {
    const { domain } = this.state
    this.getTopics(domain)
  }

  reset = () => {
    this.setState(init)
  }

  render() {
    const { classes, user } = this.props
    const { loading, notices, topics, rowsPerPage, count, page, boardName } = this.state
    const domain = this.props.match.params.domain
    const extract = (item, notice = false) => (
      item.map(i => {
        return (
          <TableRow
            key={i.id}
            selected={false}
            onClick={e => this.handleClick(e, i.id)}
            className={notice && classes.row}
            hover
          >
            <TableCell className={classes.numeric}>{notice ? (<FontAwesomeIcon icon='flag' />) : i.id}</TableCell>
            <TableCell className={notice && classes.bold} component='th' scope='row'>
              {i.isBest > 0 && (
                <img src={i.isBest > 1 ? StarIcon : BurnIcon} className={classes.star} />
              )}
              {i.title}
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
    const override = {
      position: 'absolute',
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
              onDelete={this.replay}
              deleteIcon={<FontAwesomeIcon icon='sync' />}
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
          <div className={classes.tableWrapper}>
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
                {extract(notices, true)}
                {extract(topics)}
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
        </Card>
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

List.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(List)