const pool = require('..')

module.exports = async userId => {
  await pool.query(
    `UPDATE Notices SET confirm = 1 WHERE userId = ? AND confirm = 0`,
    [userId]
  )
}

module.exports.updateNoticeByConfirm = async (userId, topicId) => {
  await pool.query(
    `UPDATE Notices SET confirm = 1 WHERE userId = ? AND topicId = ? AND confirm = 0`,
    [userId, topicId]
  )
}