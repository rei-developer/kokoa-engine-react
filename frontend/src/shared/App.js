import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Home, About, Posts } from 'pages'
import Menu from 'components/Menu'
import { Button } from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'

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
        <Route path='/posts' component={Posts} />
        <Button
          color='primary'
        >
          안녕
        </Button>
      </>
    )
  }
}

export default App