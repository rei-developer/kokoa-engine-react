import 'babel-polyfill'
import 'raf/polyfill'
import 'core-js/es6/map'
import 'core-js/es6/set'
import 'react-app-polyfill/ie9'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import './index.css'
import 'react-toastify/dist/ReactToastify.css'
import Root from './client/Root'
import * as serviceWorker from './serviceWorker'
import RootStore from './stores'

const root = new RootStore()

ReactDOM.render(
  <Provider {...root}>
    <Root />
  </Provider>,
  document.getElementById('root')
)

serviceWorker.register()