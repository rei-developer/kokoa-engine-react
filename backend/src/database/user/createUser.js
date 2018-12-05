import pool from '..'

module.exports = async (username, nickname, email, password, salt) => {
  const result = await pool.query(
    `INSERT INTO users (username, nickname, email, password, salt)
     VALUES (?, ?, ?, ?, ?)`,
    [username, nickname, email, password, salt]
  )
  return result.insertId
}