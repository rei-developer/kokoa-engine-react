const pool = require('./index')

module.exports = async (hits, topicId) => {
  await pool.query(
    `UPDATE TopicCounts SET hits = hits + ? WHERE topicId = ?`,
    [hits, topicId]
  )
}