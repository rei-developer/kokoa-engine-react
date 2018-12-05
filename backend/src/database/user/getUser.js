import pool from '..'

exports = async (username) => {
  const result = await pool.query(
    `SELECT name, email, profileImageUrl, level, exp, point, isAdmin, isVerified FROM users WHERE username = ?`,
    [username]
  )
  if (result.length < 1) return false
  return result[0]
}

exports.auth = async (username) => {
  const result = await pool.query(
    `SELECT password, salt FROM users WHERE username = ?`,
    [username]
  )
  if (result.length < 1) return false
  return result[0]
}

exports.username = async (username) => {
  const result = await pool.query(
    `SELECT id FROM users WHERE username = ?`,
    [username]
  )
  if (result.length < 1) return false
  return result[0]
}

exports.email = async (email) => {
  const result = await pool.query(
    `SELECT id FROM users WHERE email = ?`,
    [email]
  )
  if (result.length < 1) return false
  return result[0]
}