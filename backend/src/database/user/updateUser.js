import pool from '..'
import _ from 'lodash'

module.exports = async (columns, userId) => {
  let keys = []
  let values = []
  _.forIn(columns, (value, key) => {
    keys.push(key)
    values.push(value)
  })
  await pool.query(
    `UPDATE Users SET
    ${keys.map(key => `${key} = ?`).join(', ')}
    WHERE id = ?
    `,
    [...values, userId]
  )
}