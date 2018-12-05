import util from 'util'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const { EMAIL_USER, EMAIL_PASSWORD } = process.env
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
})

transporter.sendMail = util.promisify(transporter.sendMail)

module.exports = async (to, subject, html) => {
  const options = { from: EMAIL_USER, to, subject, html }
  try {
    await transporter.sendMail(options)
    return true
  } catch (e) {
    throw e
  }
}