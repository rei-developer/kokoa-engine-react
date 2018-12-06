import Koa from 'koa'
import Logger from 'koa-logger'
import bodyParser from 'koa-bodyparser'
import Router from 'koa-router'
import dotenv from 'dotenv'
import api from './api'

dotenv.config()

const app = new Koa()
const router = new Router()

router.use(Logger())
router.use(bodyParser())
router.use('/api', api.routes())
router.get('/', async ctx => ctx.body = 'HAWAWA')

app.use(router.routes()).use(router.allowedMethods())

const { PORT, CONSOLE_CLEAN } = process.env

app.listen(PORT, () => {
    console.log(`${CONSOLE_CLEAN === 'true' ? '\x1Bc' : ''}HAWAWA server is listening to port ${PORT}`)
})