import Router from 'koa-router'
import authCtrl from './auth.controller'

const app = new Router()

app.post('/signin', authCtrl.getAuth)

app.post('/signup', authCtrl.createUser)

/*app.get('/', authCtrl.get)
app.post('/', authCtrl.create)
app.delete('/', authCtrl.delete)
app.put('/', authCtrl.replace)
app.patch('/', authCtrl.update)*/

module.exports = app