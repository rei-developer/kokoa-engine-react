import jwt from 'jsonwebtoken'
import bkfd2Password from 'pbkdf2-password'
import Crypto from '../../lib/crypto'
import SendMail from '../../lib/email'
import getUser from '../../database/user/getUser'
import createUser from '../../database/user/createUser'

const hasher = bkfd2Password()

exports.getAuth = async ctx => {
  const { username, password } = ctx.request.body
  if (username === '' || password === '') return
  const user = await getUser.auth(username)
  if (!user) return ctx.body = { message: '존재하지 않는 계정입니다.', status: 'fail' }
  try {
    const result = await new Promise((resolve, reject) => {
      hasher({ password, salt: user.salt }, (err, pass, salt, hash) => {
        if (err) return reject({ message: err, status: 'fail' })
        if (user.password !== hash) return reject({ message: '비밀번호가 올바르지 않습니다.', status: 'fail' })
        if (user.isVerified < 1) return reject({ message: '이메일을 인증하지 않았습니다.', status: 'fail' })
        const token = jwt.sign(
          { jti: user.id },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        )
        resolve({ token, status: 'ok' })
      })
    })
    ctx.body = result
  } catch (e) {
    ctx.body = e
  }
}

exports.createUser = async ctx => {
  const { username, nickname, email, authCode, password } = ctx.request.body
  if (username === '' || nickname === '' || email === '' || authCode === '' || password === '') return
  const getUsername = await getUser.username(username)
  if (getUsername) return ctx.body = { message: '이미 존재하는 아이디입니다.', status: 'fail' }
  const getNickname = await getUser.nickname(nickname)
  if (getNickname) return ctx.body = { message: '이미 존재하는 닉네임입니다.', status: 'fail' }
  const getEmail = await getUser.email(email)
  if (getEmail) return ctx.body = { message: '이미 존재하는 이메일입니다.', status: 'fail' }
  try {
    if (email !== Crypto.decrypt(authCode)) return ctx.body = { message: '인증코드가 올바르지 않습니다.', status: 'fail' }
  } catch (e) {
    return ctx.body = { message: '인증코드가 올바르지 않습니다.', status: 'fail' }
  }
  try {
    const result = await new Promise((resolve, reject) => {
      hasher({ password }, async (err, pass, salt, hash) => {
        if (err) return reject({ message: err, status: 'fail' })
        await createUser({ username, nickname, email, password: hash, salt })
        resolve({ status: 'ok' })
      })
    })
    ctx.body = result
  } catch (e) {
    ctx.body = e
  }
}

exports.sendMail = async ctx => {
  const { email } = ctx.request.body
  if (email === '') return
  const getEmail = await getUser.email(email)
  if (getEmail) return ctx.body = { message: '이미 존재하는 이메일입니다.', status: 'fail' }
  const decrypt = Crypto.encrypt(email).replace(/=+/g, '')
  const subject = `[HAWAWA] 회원가입 인증코드 발송 안내`
  const content = `<p><h1>HAWAWA</h1></p>
    <p><h3>인증코드 : ${decrypt}</h3></p>
    <p>상기 인증코드를 기입해주세요.</p>`
  try {
    await SendMail(email, subject, content)
    ctx.body = { status: 'ok' }
  } catch (e) {
    ctx.body = { message: e.message, status: 'fail' }
  }
}

exports.getUser = async ctx => {
  const user = ctx.state.user
  ctx.body = { user, status: 'ok' }
}