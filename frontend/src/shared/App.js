import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import {
  Home,
  About,
  TopicContent,
  TopicList,
  TopicWrite,
  SignIn,
  SignUp
} from 'pages'
import Header from 'components/Header'
import { ToastContainer } from 'react-toastify'

class App extends Component {
  render() {
    return (
      <>
        <ToastContainer autoClose={2000} />
        <Header />
        <Switch>
          <Route path='/read/:id' component={TopicContent} />
          <Route exact path='/' component={Home} />
        </Switch>
        <Switch>
          <Route path='/about/:name' component={About} />
          <Route path='/about' component={About} />
        </Switch>
        <Switch>
          <Route path='/b/:domain/write' component={TopicWrite} />
          <Route path='/b/:domain' component={TopicList} />
          <Route path='/b/best' component={TopicList} />
          <Route path='/b/all' component={TopicList} />
        </Switch>
        <Route path='/signin' component={SignIn} />
        <Route path='/signup' component={SignUp} />
      </>
    )
  }
}

export default App