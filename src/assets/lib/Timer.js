export default {
  now(ts) {
    let now = ts ? new Date(ts) : new Date()
    now = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    return now
  },

  fromISODate(date) {
    const d = new Date(date)
    return d.getTime() + d.getTimezoneOffset() * 60000
  },

  dateOf(ts) {
    const now = this.now(ts)
    return {
      date: Math.floor(now.getTime() / 86400000),
      dateStr: now.toISOString().substr(0, 10),
    }
  },

  dateToString(date) {
    return new Date(date * 86400000).toISOString().substr(0, 10)
  },

  monthOf(ts) {
    const now = this.now(ts)
    return (now.getUTCFullYear() - 1900) * 12 + now.getUTCMonth()
  },

  firstDayOfMonth(ts) {
    const now = this.now(ts)
    return this.dateOf(new Date(now.getUTCFullYear(), now.getUTCMonth(), 1).getTime())
  },

  lastDayOfMonth(ts) {
    const now = this.now(ts)
    return this.dateOf(new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0).getTime())
  },

  daysOfMonth(ts) {
    const now = this.now(ts)
    const year = now.getUTCFullYear()
    const month = now.getUTCMonth()
    const first = new Date(year, month, 1).getTime()
    const last = new Date(year, month + 1, 1).getTime()
    return (last - first) / 86400000
  },
}
