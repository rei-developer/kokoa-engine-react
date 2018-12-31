const Router = require('koa-router')
const auth = require('./auth')
const cloud = require('./cloud')
const topic = require('./topic')

const app = new Router()

app.use('/auth', auth.routes())
app.use('/cloud', cloud.routes())
app.use('/topic', topic.routes())

module.exports = app