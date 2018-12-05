import pool from '..'

exports = async (username, password, salt, email) => {
  const result = await pool.query(
    `INSERT INTO users (username, password, salt, email)
     VALUES (?, ?, ?, ?)`,
    [username, password, salt, email]
  )
  return result.insertId
}