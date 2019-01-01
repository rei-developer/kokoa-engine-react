const schedule = require('node-schedule')
const updateTopic = require('../database/topic/updateTopic')

class Counter {
  constructor() {
    this.hits = new Map()
    schedule.scheduleJob('00 00 05 * * *', async () => {
      if (this.hits.size < 1) return
      await updateTopic.updateTopicCountsByHits(this.hits)
      this.hits.clear()
    })
  }

  getHits(id) {
    return this.hits.has(id) ? this.hits.get(id) : 0
  }

  setHits(id) {
    if (this.hits.has(id)) {
      this.hits.set(id, this.hits.get(id) + 1)
      return this.hits.get(id)
    }
    this.hits.set(id, 1)
    return 1
  }
}

module.exports = new Counter