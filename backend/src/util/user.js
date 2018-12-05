import jwt from 'jsonwebtoken'

exports.isAuthenticated = async (ctx, next) => {
  /*const token = req.headers['x-access-token'] || ''
  if (token.split('.').length < 3) return res.json({ message: '비정상적인 접근 방식입니다.', status: 'failed' })
  await jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      switch (err.name) {
        case 'TokenExpiredError':
          err.message = '토큰이 만료되었습니다. 새로 발급하시기 바랍니다.'
          break
      }
      return res.json({ message: err.message, status: 'failed' })
    }
    req.user = user
    next()
  })*/

  await next()
}