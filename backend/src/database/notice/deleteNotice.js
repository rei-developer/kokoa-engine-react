const pool = require('..')

module.exports = async userId => {
  await pool.query(
    `DELETE FROM Notices WHERE userId = ?`,
    [userId]
  )
}

module.exports.postId = async postId => {
  await pool.query(
    `DELETE FROM Notices WHERE postId = ?`,
    [postId]
  )
}