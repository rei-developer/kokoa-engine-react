const pool = require('..')

module.exports = async id => {
  await pool.query(
    `DELETE FROM Topics WHERE id = ?`,
    [id]
  )
}

module.exports.topicImages = async topicId => {
  await pool.query(
    `DELETE FROM TopicImages WHERE topicId = ?`,
    [topicId]
  )
}