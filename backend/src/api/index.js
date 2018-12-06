import Router from 'koa-router'
import auth from './auth'
import topic from './topic'

const app = new Router()

app.use('/auth', auth.routes())
app.use('/topic', topic.routes())

module.exports = app