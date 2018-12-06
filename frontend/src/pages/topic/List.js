import React from 'react'
import { Link, Route } from 'react-router-dom'
import {
  Button
} from 'reactstrap'
import { TopicContent } from 'pages'

const List = ({ match }) => {
  return (
    <div>
      <li><Link to={`${match.url}/write`}>Write</Link></li>
      <Route exact path={match.url} render={() => (<h3>Please select any post</h3>)} />
      <Route path={`${match.url}/:id`} component={TopicContent} />
      <h2>Post List</h2>
      <ul>
        <li><Link to={`${match.url}/1`}><Button color='primary'>Post #1</Button></Link></li>
        <li><Link to={`${match.url}/2`}>Post #2</Link></li>
        <li><Link to={`${match.url}/3`}>Post #3</Link></li>
        <li><Link to={`${match.url}/4`}>Post #4</Link></li>
      </ul>
      <li><Link to={`${match.url}/write`}>Write</Link></li>
    </div>
  )
}

export default List