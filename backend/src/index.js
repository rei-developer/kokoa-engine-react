import Koa from 'koa'
import Router from 'koa-router'
import dotenv from 'dotenv'
import api from './api'

dotenv.config()

const app = new Koa()
const router = new Router()

router.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.get('X-Response-Time')
    console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})
router.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})
router.use('/api', api.routes())
router.get('/', async ctx => ctx.body = 'HAWAWA')

/*router.get('/about', (ctx, next) => {
    ctx.body = '소개'
})

router.get('/about/:name', (ctx, next) => {
    const { name } = ctx.params
    ctx.body = name + '의 소개'
})

router.get('/post', (ctx, next) => {
    const { id } = ctx.request.query
    if (id) {
        ctx.body = '포스트 #' + id
    } else {
        ctx.body = '포스트 아이디가 없습니다.'
    }
})*/

app.use(router.routes()).use(router.allowedMethods())

const { PORT, CONSOLE_CLEAN } = process.env

app.listen(PORT, () => {
    console.log(`${CONSOLE_CLEAN === 'true' ? '\x1Bc' : ''}HAWAWA server is listening to port ${PORT}`)
})