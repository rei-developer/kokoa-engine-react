import Router from 'koa-router'
import topicCtrl from './topic.controller'

const app = new Router()

// http://localhost:3000/api/topic/list/default/1
app.get('/list/:type(default|all|best)/:page', topicCtrl.getList)

module.exports = app