import moment from 'moment'
import User from '../../lib/user'
import createTopic, {
  createTopicCounts,
  createTopicVotes
} from '../../database/topic/createTopic'
import getBoard from '../../database/board/getBoard'
import getTopic from '../../database/topic/getTopic'
import {
  updateTopicByIsBest,
  updateTopicByIsAllowed,
  updateTopicCountsByHits,
  updateTopicCountsByLikes,
  updateTopicCountsByHates
} from '../../database/topic/updateTopic'

const BURN_LIMIT = 3
const BEST_LIMIT = 7
const DELETE_LIMIT = 10

exports.getList = async ctx => {
  const { ...body } = ctx.request.body
  const domain = body.domain || 'all'
  const category = body.category || ''
  const page = body.page || 0
  const limit = body.limit || 20
  if (page < 0) return
  if (limit < 10 || limit > 50) return
  const obj = {}
  if (domain === 'best') obj.isBest = 2
  else if (domain !== 'all') obj.boardDomain = domain
  if (category !== '') obj.category = category
  obj.isAllowed = 1
  const count = await getTopic.count(obj)
  const notices = await getTopic.notices(domain)
  const topics = await getTopic.topics(obj, page, limit)
  ctx.body = { count, notices, topics }
}

exports.getListToWidget = async ctx => {
  const topics = await getTopic.topicsToWidget(20)
  ctx.body = topics
}

exports.getBoardName = async ctx => {
  const { domain } = ctx.params
  if (domain === 'all') return ctx.body = '전체글'
  else if (domain === 'best') return ctx.body = '인기글'
  const board = await getBoard.name(domain)
  if (!board) return ctx.body = { status: 'fail' }
  ctx.body = board
}

exports.getCategories = async ctx => {
  const { domain } = ctx.params
  const categories = await getBoard.categories(domain)
  ctx.body = categories
}

exports.getContent = async ctx => {
  const { id } = ctx.params
  if (id < 1) return
  const topic = await getTopic(id)
  if (!topic) return ctx.body = { status: 'fail' }
  ctx.body = topic
}

exports.createTopic = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    domain,
    category,
    title,
    content,
    isNotice
  } = ctx.request.body
  const isAdminOnly = await getBoard.isAdminOnly(domain)
  if (isAdminOnly < 0) return
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
    boardDomain: domain,
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

exports.createTopicVotes = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    id,
    likes
  } = ctx.request.body
  if (id < 1) return
  const topic = await getTopic(id)
  if (!topic) return ctx.body = { status: 'fail' }
  const ip = ctx.ip
  if (topic.userId === user.id || topic.ip === ip) return ctx.body = { message: '본인에게 투표할 수 없습니다.', status: 'fail' }
  const duration = moment.duration(moment().diff(topic.created))
  const hours = duration.asHours()
  if (hours > 72) return ctx.body = { message: '3일이 지난 게시물은 투표할 수 없습니다.', status: 'fail' }
  const date = await getTopic.topicVotes(user.id, id, ip)
  if (date) {
    const created = moment(date).format('YYYY/MM/DD HH:mm:ss')
    return ctx.body = { message: `이미 투표한 게시물입니다. (${created})`, status: 'fail' }
  }
  let move = ''
  if (likes) {
    if (topic.isBest === 0 && topic.likes - topic.hates >= BURN_LIMIT) {
      move = 'BURN'
      await updateTopicByIsBest(id, 1)
    } else if (topic.isBest === 1 && topic.likes - topic.hates >= BEST_LIMIT) {
      move = 'BEST'
      await updateTopicByIsBest(id, 2)
    }
    await updateTopicCountsByLikes(id)
  } else {
    if (topic.isBest === 2 && topic.hates - topic.likes >= BEST_LIMIT) {
      move = 'BURN'
      await updateTopicByIsBest(id, 1)
    } else if (topic.isBest === 1 && topic.hates - topic.likes >= BURN_LIMIT) {
      move = 'DEFAULT'
      await updateTopicByIsBest(id)
    } else if (topic.hates - topic.likes >= DELETE_LIMIT) {
      move = 'DELETE'
      await updateTopicByIsAllowed(id)
    }
    await updateTopicCountsByHates(id)
  }
  await createTopicVotes(user.id, id, ip)
  ctx.body = { move, status: 'ok' }
}

exports.createPostVotes = async ctx => {

}