import pool from '..'

module.exports = async (username) => {
  const result = await pool.query(
    `SELECT nickname, email, profileImageUrl, level, exp, point, isAdmin, isVerified FROM users WHERE username = ?`,
    [username]
  )
  if (result.length < 1) return false
  return result[0]
}