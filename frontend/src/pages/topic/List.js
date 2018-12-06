import React from 'react'
import { Link, Route } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import {
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'
import { TopicContent } from 'pages'

const init = {
  loading: true,
  domain: '',
  page: 1,
  maxPage: 1,
  limit: 5,
  topics: []
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

  getTopics = (domain) => {
    const { page, limit } = this.state
    this.setState({
      loading: false,
      domain
    }, async () => {
      const obj = {}
      obj.domain = domain
      obj.page = page - 1
      if (limit !== init.limit) obj.limit = limit
      const response = await axios.post('/api/topic/list', obj)
      const data = await response.data

      console.log('maxpage: ' + Math.ceil(data.count / limit))

      this.setState({
        loading: false,
        maxPage: data.count,//Math.ceil(data.count / limit),
        topics: [...data.topics]
      })
    })
  }

  reset() {
    this.setState(init)
  }

  paging = () => {
    const { page, maxPage, limit } = this.state
    const visibleBlock = 5
    let startRow = (page - 1) * limit
    let endRow = page * limit
    if (endRow > maxPage) endRow = maxPage
    let startPage = ((page - 1) / visibleBlock) * visibleBlock + 1
    let endPage = startPage + visibleBlock - 1
    let totalPages = maxPage / pageSize
    if (endPage > totalPages) endPage = totalPages
    let pageArr = []
    for (let i = startRow; i < endRow; i++) {
      pageArr.push(i)
    }
    return pageArr
  }

  render() {
    const { loading, page, topics } = this.state
    return (
      <div>
        <li><Link to={`${this.props.match.url}/write`}>Write</Link></li>
        <Route exact path={this.props.match.url} render={() => (<h3>Please select any post</h3>)} />
        <Route path={`${this.props.match.url}/:id`} component={TopicContent} />
        <h2>Post List</h2>
        <ul>
          {topics.map(topic => {
            return (
              <li key={topic.id}><Link to={`${this.props.match.url}/${topic.id}`}>Post #{topic.id}</Link></li>
            )
          })}
        </ul>
        <li><Link to={`${this.props.match.url}/write`}>Write</Link></li>
        <Pagination>
          <PaginationItem>
            <PaginationLink previous />
          </PaginationItem>
          {this.paging().map(p => {
            return (
              <PaginationItem active={p === page}>
                <Link to={`${this.props.match.url}/${p}`}>
                  <PaginationLink>{p}</PaginationLink>
                </Link>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationLink next />
          </PaginationItem>
        </Pagination>
      </div>
    )
  }
}

export default List