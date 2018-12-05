import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

const { CRYPTO_SECRET } = process.env

exports.encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', CRYPTO_SECRET)
  const result = cipher.update(text, 'utf8', 'base64')
  return result + cipher.final('base64')
}

exports.decrypt = (text) => {
  const decipher = crypto.createDecipher('aes-256-cbc', CRYPTO_SECRET)
  const result = decipher.update(text, 'base64', 'utf8')
  return result + decipher.final('utf8')
}