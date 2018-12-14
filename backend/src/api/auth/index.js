import Router from 'koa-router'
import authCtrl from './auth.controller'
import { isAuthenticated } from '../../lib/user'

const app = new Router()

app.get('/check', isAuthenticated, authCtrl.getUser)
app.post('/signin', authCtrl.getAuth)
app.post('/signup', authCtrl.createUser)
app.post('/accept', authCtrl.sendMail)
app.patch('/edit/profile', authCtrl.updateUserbyProfileImage)
app.patch('/edit', authCtrl.updateUser)

/*app.get('/', authCtrl.get)
app.post('/', authCtrl.create)
app.delete('/', authCtrl.delete)
app.put('/', authCtrl.replace)
app.patch('/', authCtrl.update)*/

module.exports = app