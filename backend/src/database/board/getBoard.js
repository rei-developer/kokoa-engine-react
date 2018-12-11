import pool from '..'

module.exports.name = async (domain) => {
  const result = await pool.query(
    `SELECT name FROM Boards WHERE domain = ?`,
    [domain]
  )
  if (result.length < 1) return -1
  return result[0].name
}

module.exports.isAdminOnly = async (domain) => {
  const result = await pool.query(
    `SELECT isAdminOnly FROM Boards WHERE domain = ?`,
    [domain]
  )
  if (result.length < 1) return -1
  return result[0].isAdminOnly
}

module.exports.categories = async (boardDomain) => {
  const result = await pool.query(
    `SELECT name FROM BoardCategories WHERE boardDomain = ?`,
    [boardDomain]
  )
  if (result.length < 1) return false
  return result[0]
}