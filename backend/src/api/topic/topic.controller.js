const moment = require('moment')
const User = require('../../lib/user')
const createTopic = require('../../database/topic/createTopic')
const createPost = require('../../database/topic/createPost')
const getBoard = require('../../database/board/getBoard')
const getTopic = require('../../database/topic/getTopic')
const getPost = require('../../database/topic/getPost')
const getUser = require('../../database/user/getUser')
const updateTopic = require('../../database/topic/updateTopic')

const BURN_LIMIT = 3
const BEST_LIMIT = 7
const DELETE_LIMIT = 10

exports.getListToWidget = async ctx => {
  const topics = await getTopic.topicsToWidget(20)
  ctx.body = topics
}

exports.getTopics = async ctx => {
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

exports.getPosts = async ctx => {
  const { ...body } = ctx.request.body
  const topicId = body.id || 0
  const page = body.page || 0
  const limit = body.limit || 20
  if (topicId < 0 || page < 0) return
  if (limit < 10 || limit > 50) return
  const count = await getPost.count(topicId)
  const posts = await getPost.posts(topicId, page, limit)
  ctx.body = { count, posts }
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

  // 임시
  await updateTopic.updateTopicCountsByHits(id)

  ctx.body = { topic }
}

exports.createTopic = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    domain,
    category,
    title,
    content,
    isNotice,
    images
  } = ctx.request.body
  if (title === '' || content === '') return
  const isAdminOnly = await getBoard.isAdminOnly(domain)
  if (isAdminOnly < 0) return
  if (user.isAdmin < isAdminOnly) return ctx.body = { message: '권한이 없습니다.', status: 'fail' }
  if (user.isAdmin < 1) {
    //TODO: 관리자 전용 커스텀
    if (isNotice > 0) isNotice = 0
  }
  const ip = ctx.req.headers['X-Real-IP']
  const header = ctx.header['user-agent']
  const isImage = images.length > 0 ? true : false
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
  await createTopic.createTopicCounts(topicId)
  if (isImage) await createTopic.createTopicImages(topicId, images)
  await User.setUpExpAndPoint(user, 10, 10)
  ctx.body = { topicId, status: 'ok' }
}

exports.createPost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    topicId,
    postRootId,
    postParentId,
    content
  } = ctx.request.body
  if (content === '') return
  const ip = ctx.req.headers['X-Real-IP']
  const header = ctx.header['user-agent']
  const postId = await createPost({
    userId: user.id,
    topicId,
    postRootId,
    postParentId,
    author: user.nickname,
    content,
    ip,
    header
  })
  //임시
  const postsCount = await getPost.count(topicId)
  const posts = await getPost.posts(topicId, 0, 100)
  await createPost.createPostCounts(postId)
  await User.setUpExpAndPoint(user, 5, 5)
  ctx.body = { postId, postsCount, posts, status: 'ok' }
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
  const targetUser = await getUser(topic.userId)
  const ip = ctx.req.headers['X-Real-IP']
  if (targetUser === user.id || topic.ip === ip) return ctx.body = { message: '본인에게 투표할 수 없습니다.', status: 'fail' }
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
      await updateTopic.updateTopicByIsBest(id, 1)
      await User.setUpExpAndPoint(targetUser, 20, 20)
    } else if (topic.isBest === 1 && topic.likes - topic.hates >= BEST_LIMIT) {
      move = 'BEST'
      await updateTopic.updateTopicByIsBest(id, 2)
      await User.setUpExpAndPoint(targetUser, 100, 100)
    } else {
      await User.setUpExpAndPoint(targetUser, 5, 5)
    }
    await updateTopic.updateTopicCountsByLikes(id)
  } else {
    if (topic.isBest === 2 && topic.hates - topic.likes >= BEST_LIMIT) {
      move = 'BURN'
      await updateTopic.updateTopicByIsBest(id, 1)
      await User.setUpExpAndPoint(targetUser, -100, -100)
    } else if (topic.isBest === 1 && topic.hates - topic.likes >= BURN_LIMIT) {
      move = 'DEFAULT'
      await updateTopic.updateTopicByIsBest(id)
      await User.setUpExpAndPoint(targetUser, -20, -20)
    } else if (topic.hates - topic.likes >= DELETE_LIMIT) {
      move = 'DELETE'
      await updateTopic.updateTopicByIsAllowed(id)
      await User.setUpExpAndPoint(targetUser, -10, -10)
    } else {
      await User.setUpExpAndPoint(targetUser, -5, -5)
    }
    await updateTopic.updateTopicCountsByHates(id)
  }
  await createTopic.createTopicVotes(user.id, id, ip)
  ctx.body = { move, status: 'ok' }
}

exports.createPostVotes = async ctx => {

}