const redis = require('redis')
const client = redis.createClient()
const schedule = require('node-schedule')
const updateTopic = require('./database/update')

schedule.scheduleJob('00 00 05 * * *', () => {
  client.keys('*', async (err, keys) => {
    if (err) return
    const jobs = keys.map(key => new Promise(resolve => {
      client.get(key, async (err, value) => {
        if (err) return resolve(true)
        await updateTopic(Number(value), Number(key))
        resolve(true)
      })
    }))
    await Promise.all(jobs)
      .then(() => {
        client.flushdb(() => { })
      })
  })
})