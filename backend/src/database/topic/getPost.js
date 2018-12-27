const pool = require('..')

module.exports.count = async topicId => {
  const result = await pool.query(
    `SELECT COUNT(*) count FROM Posts WHERE topicId = ?`,
    [topicId]
  )
  return result[0].count
}

module.exports.posts = async (topicId, page, limit) => {
  const result = await pool.query(
    `SELECT id, userId, author, content, created,
    (SELECT likes FROM PostCounts WHERE postId = A.id) likes,
    (SELECT hates FROM PostCounts WHERE postId = A.id) hates,
    (SELECT profileImageUrl FROM Users WHERE id = A.userId) profile,
    (SELECT isAdmin FROM Users WHERE id = A.userId) admin
    FROM Posts A
    WHERE topicId = ?
    ORDER BY id
    LIMIT ?, ?`,
    [topicId, page * limit, limit]
  )
  if (result.length < 1) return false
  return result
}