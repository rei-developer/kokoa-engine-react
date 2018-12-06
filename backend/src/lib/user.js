import jwt from 'jsonwebtoken'
import getUser from '../database/user/getUser'

module.exports.getUser = async (token) => {
  const TOKEN = token || ''
  if (TOKEN.split('.').length < 3) return false
  try {
    const result = await new Promise((resolve, reject) => {
      jwt.verify(TOKEN, process.env.JWT_SECRET, async (err, payload) => {
        if (err) return reject(false)
        const user = await getUser(payload.jti)
        if (!user) return reject(false)
        user.id = payload.jti
        resolve(user)
      })
    })
    return result
  } catch (e) {
    return e
  }
}

module.exports.isAuthenticated = async (ctx, next) => {
  const TOKEN = ctx.get('x-access-token') || ''
  if (TOKEN.split('.').length < 3) return
  await jwt.verify(TOKEN, process.env.JWT_SECRET, async (err, payload) => {
    if (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          err.message = '토큰이 만료되었습니다. 새로 로그인하세요.'
          break
      }
      return ctx.body = { message: err.message, status: 'fail' }
    }
    const user = await getUser(payload.jti)
    if (!user) return ctx.body = { message: '존재하지 않는 계정입니다.', status: 'fail' }
    ctx.state.user = user
    await next()
  })
}