const pool = require('..')

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

module.exports.updateTopicCountsByHits = async maps => {
  let items = []
  for (let [id, hits] of maps) {
    items.push({ id, hits })
  }
  await pool.query(
    `UPDATE TopicCounts SET hits = hits + ? WHERE topicId = ?`,
    items
      .map(item => [item.hits, item.id])
      .reduce((acc, current) => [...acc, ...current], [])
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