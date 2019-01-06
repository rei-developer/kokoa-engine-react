const pool = require('..')

module.exports = async id => {
  await pool.query(
    `DELETE FROM Posts WHERE id = ?`,
    [id]
  )
}