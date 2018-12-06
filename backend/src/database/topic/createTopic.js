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