import pool from '..'

module.exports.updateTopicByIsBest = async (topicId, isBest = 0) => {
  await pool.query(
    `UPDATE Topics SET isBest = ? WHERE id = ?`,
    [isBest, topicId]
  )
}

module.exports.updateTopicByIsAllowed = async (topicId, isAllowed = 0) => {
  await pool.query(
    `UPDATE Topics SET isAllowed = ? WHERE id = ?`,
    [isAllowed, topicId]
  )
}

module.exports.updateTopicCountsByHits = async (topicId, hits = 1) => {
  await pool.query(
    `UPDATE TopicCounts SET hits = hits + ? WHERE topicId = ?`,
    [hits, topicId]
  )
}

module.exports.updateTopicCountsByLikes = async (topicId, likes = 1) => {
  await pool.query(
    `UPDATE TopicCounts SET likes = likes + ? WHERE topicId = ?`,
    [likes, topicId]
  )
}

module.exports.updateTopicCountsByHates = async (topicId, hates = 1) => {
  await pool.query(
    `UPDATE TopicCounts SET hates = hates + ? WHERE topicId = ?`,
    [hates, topicId]
  )
}