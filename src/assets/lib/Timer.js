export default {
  now(ts) {
    let now = ts ? new Date(ts) : new Date()
    now = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    return now
  },

  dateOf(ts) {
    const now = this.now(ts)
    return {
      date: Math.floor(now.getTime() / 86400000),
      dateStr: now.toISOString().substr(0, 10),
    }
  },

  monthOf(ts) {
    const now = this.now(ts)
    return now.getYear() * 12 + now.getMonth()
  },

  firstDayOfMonth(ts) {
    const now = this.now(ts)
    return this.dateOf(new Date(now.getFullYear(), now.getMonth(), 1).getTime())
  },

  daysOfMonth(ts) {
    const now = this.now(ts)
    const year = now.getFullYear()
    const month = now.getMonth()
    const first = new Date(year, month, 1).getTime()
    const last = new Date(year, month + 1, 1).getTime()
    return (last - first) / 86400000
  },
}
