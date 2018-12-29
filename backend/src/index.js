const Koa = require('koa')
const Logger = require('koa-logger')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const helmet = require('koa-helmet')
const dotenv = require('dotenv')
const api = require('./api')

dotenv.config()

const app = new Koa()
const router = new Router()

app.proxy = true
router.use(helmet())
router.use(Logger())
router.use(bodyParser())
router.use('/api', api.routes())
router.get('/', async ctx => {
    ctx.body = ctx.socket.remoteAddress
})

app.use(router.routes()).use(router.allowedMethods())

const { PORT, CONSOLE_CLEAN } = process.env

app.listen(PORT, () => {
    console.log(`${CONSOLE_CLEAN === 'true' ? '\x1Bc' : ''}HAWAWA server is listening to port ${PORT}`)
})