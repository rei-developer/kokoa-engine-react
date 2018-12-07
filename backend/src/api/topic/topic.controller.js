import { getUser } from '../../lib/user'
import createTopic, { createTopicCounts } from '../../database/topic/createTopic'
import getBoard from '../../database/board/getBoard'
import getTopic from '../../database/topic/getTopic'

exports.getList = async ctx => {
  const { ...body } = ctx.request.body
  const domain = body.domain || 'all'
  const page = body.page || 0
  const limit = body.limit || 20
  if (page < 0) return
  if (limit < 10 || limit > 50) return
  const obj = {}
  if (body.domain !== 'all') obj.boardDomain = domain
  obj.isAllowed = 1
  const count = await getTopic.count(obj)
  const topics = await getTopic.topics(obj, page, limit)
  ctx.body = { count, topics }
}

exports.getContent = async ctx => {
  const { id } = ctx.params
  if (id < 1) return
  const topic = await getTopic(id)
  if (!topic) return ctx.body = { status: 'fail' }
  ctx.body = topic
}

exports.createTopic = async ctx => {
  const user = await getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    boardDomain,
    category,
    title,
    content,
    isNotice
  } = ctx.request.body
  const isAdminOnly = await getBoard.isAdminOnly(boardDomain)
  if (user.isAdmin < isAdminOnly) return ctx.body = { message: '권한이 없습니다.', status: 'fail' }
  if (user.isAdmin < 1) {
    //TODO: 관리자 전용 커스텀
    if (isNotice > 0) isNotice = 0
  }
  const ip = ctx.ip
  const header = ctx.header['user-agent']
  const isImage = false
  const topicId = await createTopic({
    userId: user.id,
    boardDomain,
    category,
    author: user.nickname,
    title,
    content,
    ip,
    header,
    isImage,
    isNotice
  })
  await createTopicCounts(topicId)
  ctx.body = { topicId, status: 'ok' }
}