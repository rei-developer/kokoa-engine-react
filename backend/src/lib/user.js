import jwt from 'jsonwebtoken'

exports.isAuthenticated = async (ctx, next) => {
  const TOKEN = ctx.get('x-access-token') || ''
  if (TOKEN.split('.').length < 3) return ctx.body = { message: '비정상적인 접근 방식입니다.', status: 'fail' }
  await jwt.verify(TOKEN, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          err.message = '토큰이 만료되었습니다. 새로 발급하시기 바랍니다.'
          break
      }
      return ctx.body = { message: err.message, status: 'fail' }
    }
    ctx.request.user = user
    await next()
  })
}