const Router = require('koa-router')
const auth = require('./auth')
const cloud = require('./cloud')
const notice = require('./notice')
const topic = require('./topic')

const app = new Router()

const VERSION = 20

app.get('/version', ctx => ctx.body = { version: VERSION, status: 'ok' })
app.use('/auth', auth.routes())
app.use('/cloud', cloud.routes())
app.use('/notice', notice.routes())
app.use('/topic', topic.routes())

module.exports = app