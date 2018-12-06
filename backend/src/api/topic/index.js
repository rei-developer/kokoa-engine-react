import Router from 'koa-router'
import topicCtrl from './topic.controller'

const app = new Router()

app.get('/read/:id', topicCtrl.getContent)
app.post('/list', topicCtrl.getList)
app.post('/write', topicCtrl.createTopic)

module.exports = app