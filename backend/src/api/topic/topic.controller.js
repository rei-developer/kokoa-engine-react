import getUser from '../../database/user/getUser'
import getTopic from '../../database/topic/getTopic'

exports.getList = async ctx => {
  const { type, page } = ctx.params
  const list = ctx.request.query.list || 20
  let result = {}
  switch (type) {
    case 'all':
    break
    case 'best':
    break
    default:
    result = await getTopic(type)
  }
  ctx.body = result
}