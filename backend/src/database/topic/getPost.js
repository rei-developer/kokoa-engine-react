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
    `SELECT
      p.id,
      p.userId,
      p.postRootId,
      p.postParentId,
      p.author,
      p.content,
      p.created,
      tp.author tagAuthor,
      tp.userId tagUserId,
      pc.likes,
      pc.hates,
      u.profileImageUrl profile,
      u.isAdmin admin
    FROM Posts p
    LEFT JOIN Posts tp ON tp.id = p.postParentId
    LEFT JOIN PostCounts pc ON pc.postId = p.id
    LEFT JOIN Users u ON u.id = p.userId
    WHERE p.topicId = ?
    ORDER BY IF(ISNULL(p.postRootId), p.id, p.postRootId), p.id
    LIMIt ?, ?`,
    [topicId, page * limit, limit]
  )
  if (result.length < 1) return false
  return result
}