import pool from '..'
import _ from 'lodash'

module.exports = async (id) => {
  const result = await pool.query(
    `SELECT userId, boardDomain, originBoardDomain, category, author, title, content, ip, header, created, updated, isImage, isBest, isNotice FROM Topics WHERE id = ?`,
    [id]
  )
  if (result.length < 1) return false
  return result[0]
}