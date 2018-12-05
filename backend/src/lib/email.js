import util from 'util'
import nodemailer from 'nodemailer'
import smtpTransport from 'nodemailer-smtp-transport'
import dotenv from 'dotenv'

dotenv.config()

const { EMAIL_USER, EMAIL_PASSWORD } = process.env
const transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD
  }
}))

transporter.sendMail = util.promisify(transporter.sendMail)

module.exports = async (to, subject, html) => {
  const options = { from: 'admin@nakonako.net', to, subject, html }
  try {
    await transporter.sendMail(options)
    return true
  } catch (e) {
    console.log(e)
    throw e
  }
}