import jwt from 'jsonwebtoken'
import bkfd2Password from 'pbkdf2-password'
import crypto from '../../util/crypto'
import sendMail from '../../util/email'
import { isAuthenticated } from '../../util/user'
import getUser from '../../database/user/getUser'
import createUser from '../../database/user/createUser'

/*

  async (req, res) => {
    const { username, password } = req.body
    if (username === '' || password === '') return res.end()
    const user = await getUser.byAuth(username)
    if (!user) return res.json({ message: '존재하지 않는 계정입니다.', status: 'failed' })
    const hasher = bkfd2Password()
    hasher({ password, salt: user.salt }, (err, pass, salt, hash) => {
      if (err) return res.json({ message: err, status: 'failed' })
      if (user.password !== hash) return res.json({ message: '비밀번호가 올바르지 않습니다.', status: 'failed' })
      if (user.isVerified < 1) return res.json({ message: '이메일 인증을 완료해주십시오.', status: 'failed' })
      const token = jwt.sign(
        { jti: username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      )
      res.json({ token, status: 'ok' })
    })
  }

*/

exports.getAuth = async (ctx) => {
    ctx.body = 'asdfsafdsad'
}

exports.createUser = async (ctx) => {
    ctx.body = 'asdfsafdsad'
}