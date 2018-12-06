import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  Home,
  About,
  TopicList,
  TopicWrite,
  SignIn,
  SignUp
} from 'pages'
import Menu from 'components/Menu'
import { ToastContainer } from 'react-toastify'

class App extends Component {
  render() {
    return (
      <>
        <ToastContainer autoClose={2000} />
        <Menu />
        <Route exact path='/' component={Home} />
        <Switch>
          <Route path='/about/:name' component={About} />
          <Route path='/about' component={About} />
        </Switch>
        <Switch>
          <Route path='/topic/write' component={TopicWrite} />
          <Route path='/topic' component={TopicList} />
        </Switch>
        <Route path='/signin' component={SignIn} />
        <Route path='/signup' component={SignUp} />
      </>
    )
  }
}

export default App