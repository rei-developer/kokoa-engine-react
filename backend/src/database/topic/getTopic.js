import pool from '..'
import _ from 'lodash'

module.exports = async (columns) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  const result = await pool.query(
    `INSERT INTO test SET
    ${keys.map(key => `${key} = ?`).join(', ')}`,
    [...values]
  )
  return result.insertId
}