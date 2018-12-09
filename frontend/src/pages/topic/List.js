import React from 'react'
import { Link, Route } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { TopicContent } from 'pages'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
  IconButton
} from '@material-ui/core'
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@material-ui/icons'

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
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label='Previous Page'
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Next Page'
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='Last Page'
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
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

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  table: {
    minWidth: 500
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  author: {
    width: 140
  },
  numeric: {
    width: 40
  },
  pointer: {
    cursor: 'pointer'
  }
})

const init = {
  loading: true,
  topics: [],
  count: 0,
  page: 0,
  rowsPerPage: 20,
  domain: ''
}

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = init
  }

  componentWillMount() {
    const domain = this.props.match.params.domain
    this.getTopics(domain)
  }

  componentWillReceiveProps(nextProps) {
    const domain = this.props.match.params.domain
    const nextDomain = nextProps.match.params.domain
    if (domain === nextDomain) return
    this.reset()
    this.getTopics(nextDomain)
  }

  handleClick = (e, id) => {
    window.scrollTo(0, 0)
    this.props.history.push(`${this.props.match.url}/${id}`)
  }

  handleChangePage = (e, page) => {
    const domain = this.props.match.params.domain
    this.setState({
      loading: true,
      page
    }, () => {
      this.getTopics(domain)
    })
  }

  handleChangeRowsPerPage = e => {
    const domain = this.props.match.params.domain
    this.setState({
      loading: true,
      rowsPerPage: e.target.value
    }, () => {
      this.getTopics(domain)
    })
  }

  getTopics = (domain) => {
    const { page, rowsPerPage } = this.state
    this.setState({
      loading: false,
      domain
    }, async () => {
      const obj = {}
      obj.domain = domain
      obj.page = page
      if (rowsPerPage !== init.rowsPerPage) obj.limit = rowsPerPage
      const response = await axios.post('/api/topic/list', obj)
      const data = await response.data
      this.setState({
        loading: false,
        topics: data.topics ? [...data.topics] : [],
        count: data.count
      })
    })
  }

  reset() {
    this.setState(init)
  }

  render() {
    const { classes } = this.props
    const { loading, topics, rowsPerPage, count, page } = this.state
    return (
      <>
        <Route path={`${this.props.match.url}/:id`} component={TopicContent} />
        <Link to={`${this.props.match.url}/write`}>Write</Link>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>순번</TableCell>
                <TableCell>제목</TableCell>
                <TableCell>작성자</TableCell>
                <TableCell>조회</TableCell>
                <TableCell>추천</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className={classes.pointer}>
              {topics.map(i => {
                return (
                  <TableRow
                    key={i.id}
                    selected={false}
                    onClick={e => this.handleClick(e, i.id)}
                    hover
                  >
                    <TableCell className={classes.numeric}>{i.id}</TableCell>
                    <TableCell component='th' scope='row'>{i.title}</TableCell>
                    <TableCell className={classes.author}>{i.author}</TableCell>
                    <TableCell className={classes.numeric}>{i.hits}</TableCell>
                    <TableCell className={classes.numeric}>{i.likes}</TableCell>
                  </TableRow>
                )
              })}
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
      </>
    )
  }
}

List.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(List)