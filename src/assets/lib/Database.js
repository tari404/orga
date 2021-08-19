import Timer from './Timer'

const DB_NAME = 'orga'
const DB_VERSION = 1

// eslint-disable-next-line no-unused-vars
const _diary_template = {
  date: 18807,
  dateStr: '2021/6/29',
  targets: [
    {
      content: '今天要完成BalaBala...',
      finished: false,
    },
  ],
  goal: 300,
  rewards: -10,
  updated: false,
  delay: false,
}

// eslint-disable-next-line no-unused-vars
const _monthly_template = {
  month: 1457,
  grow: 900,
  spend: [
    {
      content: '买了什么东西',
      value: 120,
    },
  ],
}

export default class Database {
  constructor() {
    this.afterOpened = []
    this.opening = false
  }

  async openDB() {
    if (this.db && this.db instanceof IDBDatabase) {
      return true
    }
    const p = new Promise((resolve) => {
      this.afterOpened.push(resolve)
    })

    if (!this.opening) {
      this.opening = true

      let upgradeneeded = false
      const db = await new Promise((resolve) => {
        const openRequest = indexedDB.open(DB_NAME, DB_VERSION)
        openRequest.onupgradeneeded = (event) => {
          upgradeneeded = true
          const db = event.target.result
          db.createObjectStore('diary', { keyPath: 'date' })
          db.createObjectStore('monthly', { keyPath: 'month' })
          db.createObjectStore('states')
        }
        openRequest.onsuccess = () => {
          console.log(
            'Use IndexedDB:',
            openRequest.result.name,
            'version:',
            openRequest.result.version
          )
          resolve(openRequest.result)
        }
        openRequest.onerror = () => {
          console.warn('IndexedDB could not be initialized')
          resolve(null)
        }
      })
      let status = true
      this.db = db
      if (db && upgradeneeded) {
        status = await this.initDB(this.db)
      }
      const result = db && status
      this.afterOpened.forEach((cb) => {
        cb(result)
      })
    }

    return p
  }

  async initDB(db) {
    if (!db || !(db instanceof IDBDatabase)) {
      throw new TypeError('expect IDBDatabase')
    }

    const store = db.transaction('states', 'readwrite').objectStore('states')
    store.add('orga', 'name')
    store.add(0, 'balance')
    store.add(0, 'updateAt')
  }

  async add(store, date) {
    return new Promise((resolve) => {
      if (!(this.db instanceof IDBDatabase)) {
        return resolve(false)
      }
      const saveRequest = this.db.transaction(store, 'readwrite').objectStore(store).add(date)
      saveRequest.onsuccess = async () => {
        resolve(true)
      }
      saveRequest.onerror = () => {
        resolve(false)
      }
    })
  }

  async set(store, date, key) {
    return new Promise((resolve) => {
      if (!(this.db instanceof IDBDatabase)) {
        return resolve(false)
      }
      const saveRequest = this.db.transaction(store, 'readwrite').objectStore(store).put(date, key)
      saveRequest.onsuccess = async () => {
        resolve(true)
      }
      saveRequest.onerror = () => {
        resolve(false)
      }
    })
  }

  async get(store, key) {
    return new Promise((resolve) => {
      if (!(this.db instanceof IDBDatabase)) {
        return resolve(null)
      }
      const getRequest = this.db.transaction(store, 'readonly').objectStore(store).get(key)
      getRequest.onsuccess = (event) => {
        resolve(event.target.result)
      }
      getRequest.onerror = () => {
        resolve(null)
      }
    })
  }

  async getTotalRewards(ts = Date.now()) {
    return new Promise((resolve) => {
      if (!(this.db instanceof IDBDatabase)) {
        return resolve(NaN)
      }
      const getRequest = this.db
        .transaction('diary', 'readonly')
        .objectStore('diary')
        .getAll(IDBKeyRange.bound(Timer.firstDayOfMonth(ts).date, Timer.lastDayOfMonth(ts).date))
      getRequest.onsuccess = (event) => {
        const list = event.target.result
        const rewards = list.reduce((s, c) => s + (c.rewards || 0), 0)
        resolve(rewards)
      }
      getRequest.onerror = () => {
        resolve(NaN)
      }
    })
  }
}
