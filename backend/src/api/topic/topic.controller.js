import getUser from '../../database/user/getUser'
import getTopic from '../../database/topic/getTopic'

exports.getList = async ctx => {
  const { type, page } = ctx.params
  const { ...query } = ctx.request.query
  const page = query.page || 1
  const limit = query.limit || 20



  const columns = {}
  if (query.boardName) columns.boardName = query.boardName
  if (query.category) columns.category = query.category
  if (query.isBest) columns.isBest = query.isBest

  console.log(columns)



  ctx.body = 'a'
}

exports.createTopic = async ctx => {
  const { type, page } = ctx.params
  const list = ctx.request.query.list || 20
  const columns = {}
  columns.author = ctx.request.query.author || ''
  columns.title = ctx.request.query.title || ''
  columns.content = ctx.request.query.content || ''
  let result = {}
  switch (type) {
    case 'all':
      break
    case 'best':
      break
    default:
      result = await getTopic(columns)
  }
  ctx.body = result
}