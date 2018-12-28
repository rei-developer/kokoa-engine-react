const pool = require('..')
const _ = require('lodash')

module.exports = async id => {
  const result = await pool.query(
    `SELECT userId, boardDomain, originBoardDomain, category, author, title, content, ip, header, created, updated, isImage, isBest, isNotice, isAllowed,
    (SELECT hits FROM TopicCounts WHERE topicId = A.id) hits,
    (SELECT likes FROM TopicCounts WHERE topicId = A.id) likes,
    (SELECT hates FROM TopicCounts WHERE topicId = A.id) hates,
    (SELECT profileImageUrl FROM Users WHERE id = A.userId) profile,
    (SELECT isAdmin FROM Users WHERE id = A.userId) admin
    FROM Topics A
    WHERE id = ?`,
    [id]
  )
  if (result.length < 1) return false
  return result[0]
}

module.exports.count = async columns => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  try {
    const result = await pool.query(
      `SELECT COUNT(*) count FROM Topics WHERE
      ${keys.map(key => `${key} = ?`).join(' AND ')}
      ORDER BY id DESC`,
      [...values]
    )
    return result[0].count
  } catch (e) {
    console.log(e.message)
    return false
  }
}

module.exports.notices = async domain => {
  const result = await pool.query(
    `SELECT id, userId, originBoardDomain, category, author, title, created,
    (SELECT hits FROM TopicCounts WHERE topicId = A.id) hits,
    (SELECT likes FROM TopicCounts WHERE topicId = A.id) likes,
    (SELECT isAdmin FROM Users WHERE id = A.userId) admin
    FROM Topics A
    WHERE boardDomain = ? AND isNotice = 1
    ORDER BY id DESC`,
    [domain]
  )
  if (result.length < 1) return false
  return result
}

module.exports.topics = async (columns, page, limit) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  try {
    const result = await pool.query(
      `SELECT id, userId, originBoardDomain, category, author, title, created, isImage, isBest, isNotice,
      (SELECT hits FROM TopicCounts WHERE topicId = A.id) hits,
      (SELECT likes FROM TopicCounts WHERE topicId = A.id) likes,
      (SELECT isAdmin FROM Users WHERE id = A.userId) admin,
      (SELECT imageUrl FROM TopicImages WHERE topicId = A.id LIMIT 1) imageUrl,
      (SELECT COUNT(*) FROM Posts WHERE topicId = A.id) postsCount
      FROM Topics A
      WHERE ${keys.map(key => `${key} = ?`).join(' AND ')}
      ORDER BY id DESC
      LIMIT ?, ?`,
      [...values, page * limit, limit]
    )
    if (result.length < 1) return false
    return result
  } catch (e) {
    console.log(e.message)
    return false
  }
}

module.exports.topicsToWidget = async limit => {
  const result = await pool.query(
    `SELECT id, boardDomain, category, title, created, isBest,
    (SELECT name FROM Boards WHERE domain = A.boardDomain) boardName,
    (SELECT imageUrl FROM TopicImages WHERE topicId = A.id LIMIT 1) imageUrl
    FROM Topics A
    WHERE isAllowed = 1
    ORDER BY id DESC
    LIMIT ?`,
    [limit]
  )
  if (result.length < 1) return false
  return result
}

module.exports.topicImages = async topicId => {
  const result = await pool.query(
    `SELECT name, imageUrl FROM TopicImages WHERE topicId = ?`,
    [topicId]
  )
  if (result.length < 1) return false
  return result
}

module.exports.topicVotes = async (userId, topicId, ip) => {
  const result = await pool.query(
    `SELECT created FROM TopicVotes
    WHERE topicId = ? AND (userId = ? OR ip = ?)`,
    [topicId, userId, ip]
  )
  if (result.length < 1) return false
  return result[0].created
}