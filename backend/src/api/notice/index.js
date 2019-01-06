const Router = require('koa-router')
const noticeCtrl = require('./notice.controller')

const app = new Router()

app.get('/', noticeCtrl.getCount)
app.post('/list', noticeCtrl.getNotices)
app.delete('/clear', noticeCtrl.deleteNotices)
app.put('/readed', noticeCtrl.updateNoticesByConfirm)

module.exports = app