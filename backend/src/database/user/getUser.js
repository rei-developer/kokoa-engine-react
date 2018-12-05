import pool from '..'

module.exports = async (username) => {
  const result = await pool.query(
    `SELECT name, email, profileImageUrl, level, exp, point, isAdmin, isVerified FROM users WHERE username = ?`,
    [username]
  )
  if (result.length < 1) return false
  return result[0]
}

module.exports.auth = async (username) => {
  const result = await pool.query(
    `SELECT password, salt FROM users WHERE username = ?`,
    [username]
  )
  if (result.length < 1) return false
  return result[0]
}

module.exports.username = async (username) => {
  const result = await pool.query(
    `SELECT id FROM users WHERE username = ?`,
    [username]
  )
  if (result.length < 1) return false
  return result[0]
}

module.exports.nickname = async (nickname) => {
  const result = await pool.query(
    `SELECT id FROM users WHERE nickname = ?`,
    [nickname]
  )
  if (result.length < 1) return false
  return result[0]
}

module.exports.email = async (email) => {
  const result = await pool.query(
    `SELECT id FROM users WHERE email = ?`,
    [email]
  )
  if (result.length < 1) return false
  return result[0]
}