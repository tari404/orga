export default {
  dateWithoutTimezone(ts) {
    let d = ts ? new Date(ts) : new Date()
    d = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    return d
  },

  fromISODate(dateStr) {
    const d = new Date(dateStr)
    return d.getTime()
  },

  dateOf(ts) {
    const d = this.dateWithoutTimezone(ts)
    return {
      date: Math.floor(d.getTime() / 86400000),
      dateStr: d.toISOString().substr(0, 10),
    }
  },

  dateToString(date) {
    return new Date(date * 86400000).toISOString().substr(0, 10)
  },

  monthOf(ts) {
    let d = ts ? new Date(ts) : new Date()
    return (d.getFullYear() - 1900) * 12 + d.getMonth()
  },

  firstDateOfMonth(ts) {
    let d = ts ? new Date(ts) : new Date()
    return this.dateOf(new Date(d.getFullYear(), d.getMonth(), 1).getTime())
  },

  lastDateOfMonth(ts) {
    let d = ts ? new Date(ts) : new Date()
    return this.dateOf(new Date(d.getFullYear(), d.getMonth() + 1, 0).getTime())
  },
}
