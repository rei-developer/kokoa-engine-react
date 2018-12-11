import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { Grid, Hidden } from '@material-ui/core'
import {
  Home,
  About,
  TopicContent,
  TopicList,
  TopicWrite,
  SignIn,
  SignUp,
  Profile
} from 'pages'
import Header from 'components/Header'
import { ToastContainer } from 'react-toastify'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faPencilAlt
} from '@fortawesome/free-solid-svg-icons'

library.add(faUser)
library.add(faPencilAlt)

class App extends Component {
  render() {
    const style = {
      background: '#FAFAFA',
      minHeight: '100vh'
    }
    return (
      <div style={style}>
        <ToastContainer autoClose={2000} />
        <Header />
        <Grid container>
          <Hidden mdDown>
            <Grid item xs={2} />
          </Hidden>
          <Grid item xs>
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
            <Route path='/profile' component={Profile} />
          </Grid>
          <Hidden mdDown>
            <Grid item xs={2} />
          </Hidden>
        </Grid>
      </div>
    )
  }
}

export default App