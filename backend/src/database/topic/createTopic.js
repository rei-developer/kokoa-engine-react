import pool from '..'
import _ from 'lodash'

module.exports = async (columns) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  try {
    const result = await pool.query(
      `INSERT INTO Topics SET
      ${keys.map(key => `${key} = ?`).join(', ')}`,
      [...values]
    )
    return result.insertId
  } catch (e) {
    console.log(e.message)
    return false
  }
}

module.exports.createTopicCounts = async (topicId) => {
  await pool.query(
    `INSERT INTO TopicCounts (topicId) VALUES (?)`,
    [topicId]
  )
}

module.exports.createTopicImages = async (topicId, items) => {
  await pool.query(
    `INSERT INTO TopicImages (topicId, name, imageUrl, deletehash)
    VALUES ${items.map(() => `(?, ?, ?, ?)`).join(', ')}`,
    items
      .map(item => [topicId, item.name, item.link, item.deletehash])
      .reduce((acc, current) => [...acc, ...current], [])
  )
}

module.exports.createTopicVotes = async (userId, topicId, ip) => {
  await pool.query(
    `INSERT INTO TopicVotes (userId, topicId, ip) VALUES (?, ?, ?)`,
    [userId, topicId, ip]
  )
}