import pool from '..'
import _ from 'lodash'

module.exports = async (id) => {
  const result = await pool.query(
    `SELECT userId, boardDomain, originBoardDomain, category, author, title, content, ip, header, created, updated, isImage, isBest, isNotice, isAllowed,
    (SELECT hits FROM TopicCounts WHERE topicId = A.id) hits,
    (SELECT likes FROM TopicCounts WHERE topicId = A.id) likes,
    (SELECT hates FROM TopicCounts WHERE topicId = A.id) hates
    FROM Topics A
    WHERE id = ?`,
    [id]
  )
  if (result.length < 1) return false
  return result[0]
}

module.exports.count = async (columns) => {
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
      (SELECT isAdmin FROM Users WHERE id = A.userId) admin
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

module.exports.topicVotes = async (userId, topicId, ip) => {
  const result = await pool.query(
    `SELECT created FROM TopicVotes
    WHERE topicId = ? AND (userId = ? OR ip = ?)`,
    [topicId, userId, ip]
  )
  if (result.length < 1) return false
  return result[0].created
}