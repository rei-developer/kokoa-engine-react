const fs = require('fs')
const redis = require('redis')
const moment = require('moment')
const Filter = require('../../lib/filter')
const User = require('../../lib/user')
const createNotice = require('../../database/notice/createNotice')
const createTopic = require('../../database/topic/createTopic')
const createPost = require('../../database/topic/createPost')
const getBoard = require('../../database/board/getBoard')
const getNotice = require('../../database/notice/getNotice')
const getTopic = require('../../database/topic/getTopic')
const getPost = require('../../database/topic/getPost')
const getUser = require('../../database/user/getUser')
const updateNotice = require('../../database/notice/updateNotice')
const updateTopic = require('../../database/topic/updateTopic')
const deleteNotice = require('../../database/notice/deleteNotice')
const deletePost = require('../../database/topic/deletePost')

const client = redis.createClient()

const BURN_LIMIT = 3
const BEST_LIMIT = 5
const DELETE_LIMIT = 10

module.exports.getListToWidget = async ctx => {
  const topics = await getTopic.topicsToWidget(20)
  ctx.body = topics
}

module.exports.getTopics = async ctx => {
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
  if (topics.length > 0) {
    const jobs = topics.map(topic => new Promise(resolve => {
      client.get(topic.id, (err, value) => {
        if (err) return resolve(true)
        const hits = Number(value) || 0
        topic.hits += hits
        resolve(true)
      })
    }))
    await Promise.all(jobs)
  }
  ctx.body = { count, notices, topics }
}

module.exports.getPosts = async ctx => {
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

module.exports.getBoardName = async ctx => {
  const { domain } = ctx.params
  if (domain === 'all') return ctx.body = '전체글'
  else if (domain === 'best') return ctx.body = '인기글'
  const board = await getBoard.name(domain)
  if (!board) return ctx.body = { status: 'fail' }
  ctx.body = board
}

module.exports.getCategories = async ctx => {
  const { domain } = ctx.params
  const categories = await getBoard.categories(domain)
  ctx.body = categories
}

module.exports.getContent = async ctx => {
  const { id } = ctx.params
  if (id < 1) return
  const user = await User.getUser(ctx.get('x-access-token'))
  const topic = await getTopic(id)
  if (!topic) return ctx.body = { status: 'fail' }
  if (client.exists(id)) {
    const hits = await new Promise(resolve => {
      client.get(id, (err, value) => {
        if (err) return resolve(1)
        const hit = Number(value) + 1
        client.set(id, hit)
        resolve(hit)
      })
    })
    topic.hits += hits
  } else {
    client.set(id, 1)
    topic.hits += 1
  }
  let count = 0
  if (user) {
    await updateNotice.updateNoticeByConfirm(user.id, id)
    count = await getNotice.count(user.id)
  }
  ctx.body = { topic, count }
}

module.exports.createTopic = async ctx => {
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
  title = Filter.disable(title)
  content = Filter.topic(content)
  const isAdminOnly = await getBoard.isAdminOnly(domain)
  if (isAdminOnly < 0) return
  if (user.isAdmin < isAdminOnly) return ctx.body = { message: '권한이 없습니다.', status: 'fail' }
  if (user.isAdmin < 1) {
    //TODO: 관리자 전용 커스텀
    if (isNotice > 0) isNotice = 0
  }
  const ip = ctx.get('x-real-ip')
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

module.exports.createPost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  let {
    topicId,
    topicUserId,
    postUserId,
    postRootId,
    postParentId,
    content
  } = ctx.request.body
  if (content === '') return
  topicUserId = Number(topicUserId)
  if (postUserId) postUserId = Number(postUserId)
  content = Filter.post(content)
  const ip = ctx.get('x-real-ip')
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
  const items = []
  if (user.id !== topicUserId) items.push(topicUserId)
  if (postUserId && user.id !== postUserId && topicUserId !== postUserId) items.push(postUserId)
  const jobs = items.map(receiver => new Promise(async resolve => {
    await createNotice(receiver, topicId, postId)
    resolve(true)
  }))
  await Promise.all(jobs)
  ctx.body = { postId, postsCount, posts, status: 'ok' }
}

module.exports.createTopicVotes = async ctx => {
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
  const ip = ctx.get('x-real-ip')
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

module.exports.createPostVotes = async ctx => {

}

module.exports.deleteTopic = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  const { id } = ctx.request.body
  if (id < 1) return ctx.body = { status: 'fail' }
  const userId = await getTopic.userId(id)
  if (!userId) return ctx.body = { status: 'fail' }
  if (userId !== user.id) return

  console.log(user)

  ctx.body = { status: 'ok' }
}

module.exports.deletePost = async ctx => {
  const user = await User.getUser(ctx.get('x-access-token'))
  if (!user) return
  const { id } = ctx.request.body
  if (id < 1) return ctx.body = { status: 'fail' }
  const userId = await getPost.userId(id)
  if (!userId) return ctx.body = { status: 'fail' }
  if (userId !== user.id) return
  await deleteNotice.postId(id)
  await deletePost(id)
  ctx.body = { status: 'ok' }
}