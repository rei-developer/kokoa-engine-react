import Router from 'koa-router'
import auth from './auth'

const app = new Router()

app.use('/auth', auth.routes())

app.get('/books2', (ctx, next) => {
    ctx.body = 'GET ' + ctx.request.path
})

module.exports = app