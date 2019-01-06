const User = require('../../lib/user')
const getNotice = require('../../database/notice/getNotice')

module.exports.getCount = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  const count = await getNotice.count(user.id)
  ctx.body = { count }
}

module.exports.getNotices = async ctx => {
  const { ...body } = ctx.request.body
  const page = body.page || 0
  const limit = body.limit || 20
  if (page < 0 || limit < 10 || limit > 50) return
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  const notices = await getNotice.notices(user.id, page, limit)
  ctx.body = { notices }
}